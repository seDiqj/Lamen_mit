"""Capture app screenshots using Playwright for the Lamen Microfinance deck."""
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
USERNAME = os.environ.get("APP_USERNAME", "admin")
PASSWORD = os.environ.get("APP_PASSWORD", "LamenDemo2026!")
OUT_DIR = Path("attached_assets/ppt_screenshots")
OUT_DIR.mkdir(parents=True, exist_ok=True)

DESKTOP_PAGES = [
    ("01_dashboard", "/", "Operational Dashboard"),
    ("02_customers", "/customers", "Customers"),
    ("03_loan_application", "/loan-application", "Loan Application"),
    ("04_loans", "/loans", "Loans"),
    ("05_financing_products", "/financing-products", "Financing Products"),
    ("06_disbursements", "/disbursements", "Disbursements"),
    ("07_collections", "/collections", "Collections"),
    ("08_payments", "/payments", "Payments"),
    ("09_accounting_dashboard", "/accounting-dashboard", "Accounting Dashboard"),
    ("10_chart_of_accounts", "/chart-of-accounts", "Chart of Accounts"),
    ("11_journal_entries", "/journal-entries", "Journal Entries"),
    ("12_trial_balance", "/trial-balance", "Trial Balance"),
    ("13_income_statement", "/income-statement", "Income Statement"),
    ("14_balance_sheet", "/balance-sheet", "Balance Sheet"),
    ("15_dab_reports", "/dab-reports", "DAB Regulatory Reports"),
    ("16_hr_dashboard", "/hr/dashboard", "HR Dashboard"),
    ("17_hr_employees", "/hr/employees", "Employees"),
    ("18_hr_attendance", "/hr/attendance", "Attendance"),
    ("19_hr_leave_requests", "/hr/leave-requests", "Leave Requests"),
    ("20_hr_payroll", "/hr/payroll", "Payroll"),
    ("21_hr_recruitment", "/hr/recruitment", "Recruitment"),
    ("22_hr_performance", "/hr/performance", "Performance"),
    ("23_admin_dashboard", "/admin-dashboard", "Admin Dashboard"),
    ("24_users", "/users", "Users"),
    ("25_page_permissions", "/page-permissions", "Page Permissions"),
    ("26_branches", "/branches", "Branches"),
    ("27_activity", "/activity", "Activity Log"),
]

MOBILE_PAGES = [
    ("28_mobile_customers", "/mobile/customers", "Mobile Customers"),
    ("29_mobile_financing", "/mobile/financing", "Mobile Financing"),
    ("30_mobile_collections", "/mobile/collections", "Mobile Collections"),
]


async def login(context, viewport_label: str):
    page = await context.new_page()
    await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    # Fill the form using data-testid attributes
    try:
        await page.fill('[data-testid="input-username"]', USERNAME)
        await page.fill('[data-testid="input-password"]', PASSWORD)
        await page.click('[data-testid="button-login"]')
    except Exception:
        # Fallback: use generic input selectors
        await page.fill('input[type="text"], input[name="username"]', USERNAME)
        await page.fill('input[type="password"]', PASSWORD)
        await page.click('button[type="submit"]')
    # Wait until /api/auth/user returns ok by waiting for redirect away from /login
    try:
        await page.wait_for_url(lambda url: "/login" not in url, timeout=15000)
    except Exception:
        pass
    await page.wait_for_load_state("networkidle")
    print(f"[{viewport_label}] login complete, current URL = {page.url}")
    await page.close()


async def capture(context, slug: str, path: str, label: str):
    page = await context.new_page()
    out_file = OUT_DIR / f"{slug}.png"
    try:
        await page.goto(f"{BASE_URL}{path}", wait_until="networkidle", timeout=45000)
    except Exception as e:
        print(f"  goto error for {path}: {e}")
    # Allow charts/animations to settle
    await page.wait_for_timeout(2500)
    # Best-effort wait until any visible skeleton goes away
    try:
        await page.wait_for_function(
            "() => document.querySelectorAll('.animate-pulse').length === 0",
            timeout=8000,
        )
    except Exception:
        pass
    await page.wait_for_timeout(800)
    await page.screenshot(path=str(out_file), full_page=False)
    print(f"  saved {out_file}")
    await page.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # Desktop session
        desktop_ctx = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1,
        )
        await login(desktop_ctx, "desktop")
        for slug, path, label in DESKTOP_PAGES:
            print(f"DESKTOP -> {label} ({path})")
            await capture(desktop_ctx, slug, path, label)
        await desktop_ctx.close()

        # Mobile session - separate context with mobile viewport
        mobile_ctx = await browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            ),
        )
        # Mobile uses /mobile/login page
        mpage = await mobile_ctx.new_page()
        await mpage.goto(f"{BASE_URL}/mobile/login", wait_until="networkidle")
        try:
            await mpage.fill('[data-testid="input-username"]', USERNAME)
            await mpage.fill('[data-testid="input-password"]', PASSWORD)
            await mpage.click('[data-testid="button-login"]')
        except Exception:
            await mpage.fill('input[type="text"], input[name="username"]', USERNAME)
            await mpage.fill('input[type="password"]', PASSWORD)
            await mpage.click('button[type="submit"]')
        try:
            await mpage.wait_for_url(lambda url: "/login" not in url, timeout=15000)
        except Exception:
            pass
        await mpage.wait_for_load_state("networkidle")
        print(f"[mobile] login complete, URL = {mpage.url}")
        await mpage.close()

        for slug, path, label in MOBILE_PAGES:
            print(f"MOBILE -> {label} ({path})")
            await capture(mobile_ctx, slug, path, label)
        await mobile_ctx.close()

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
