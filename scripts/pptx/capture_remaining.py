"""Capture only the remaining screenshots (HR + admin + mobile)."""
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
    ("18_hr_attendance", "/hr/attendance"),
    ("19_hr_leave_requests", "/hr/leave-requests"),
    ("20_hr_payroll", "/hr/payroll"),
    ("21_hr_recruitment", "/hr/recruitment"),
    ("22_hr_performance", "/hr/performance"),
    ("23_admin_dashboard", "/admin-dashboard"),
    ("24_users", "/users"),
    ("25_page_permissions", "/page-permissions"),
    ("26_branches", "/branches"),
    ("27_activity", "/activity"),
]

MOBILE_PAGES = [
    ("28_mobile_customers", "/mobile/customers"),
    ("29_mobile_financing", "/mobile/financing"),
    ("30_mobile_collections", "/mobile/collections"),
]


async def login_desktop(context):
    page = await context.new_page()
    await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    await page.fill('[data-testid="input-username"]', USERNAME)
    await page.fill('[data-testid="input-password"]', PASSWORD)
    await page.click('[data-testid="button-login"]')
    try:
        await page.wait_for_url(lambda url: "/login" not in url, timeout=15000)
    except Exception:
        pass
    await page.wait_for_load_state("networkidle")
    print(f"[desktop] login complete, URL = {page.url}", flush=True)
    await page.close()


async def login_mobile(context):
    page = await context.new_page()
    await page.goto(f"{BASE_URL}/mobile/login", wait_until="networkidle")
    await page.fill('[data-testid="input-username"]', USERNAME)
    await page.fill('[data-testid="input-password"]', PASSWORD)
    await page.click('[data-testid="button-login"]')
    try:
        await page.wait_for_url(lambda url: "/login" not in url, timeout=15000)
    except Exception:
        pass
    await page.wait_for_load_state("networkidle")
    print(f"[mobile] login complete, URL = {page.url}", flush=True)
    await page.close()


async def capture(context, slug, path):
    page = await context.new_page()
    out_file = OUT_DIR / f"{slug}.png"
    try:
        await page.goto(f"{BASE_URL}{path}", wait_until="networkidle", timeout=45000)
    except Exception as e:
        print(f"  goto error for {path}: {e}", flush=True)
    await page.wait_for_timeout(2500)
    try:
        await page.wait_for_function(
            "() => document.querySelectorAll('.animate-pulse').length === 0",
            timeout=8000,
        )
    except Exception:
        pass
    await page.wait_for_timeout(800)
    await page.screenshot(path=str(out_file), full_page=False)
    print(f"  saved {out_file}", flush=True)
    await page.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        desktop_ctx = await browser.new_context(
            viewport={"width": 1440, "height": 900}, device_scale_factor=1,
        )
        await login_desktop(desktop_ctx)
        for slug, path in DESKTOP_PAGES:
            print(f"DESKTOP -> {path}", flush=True)
            await capture(desktop_ctx, slug, path)
        await desktop_ctx.close()

        mobile_ctx = await browser.new_context(
            viewport={"width": 390, "height": 844}, device_scale_factor=2,
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            ),
        )
        await login_mobile(mobile_ctx)
        for slug, path in MOBILE_PAGES:
            print(f"MOBILE  -> {path}", flush=True)
            await capture(mobile_ctx, slug, path)
        await mobile_ctx.close()

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
