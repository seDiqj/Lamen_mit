"""Capture mobile screenshots."""
import asyncio, os
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
USERNAME = os.environ.get("APP_USERNAME", "admin")
PASSWORD = os.environ.get("APP_PASSWORD", "LamenDemo2026!")
OUT_DIR = Path("attached_assets/ppt_screenshots")

MOBILE_PAGES = [
    ("28_mobile_customers", "/mobile/customers"),
    ("29_mobile_financing", "/mobile/financing"),
    ("30_mobile_collections", "/mobile/collections"),
]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/17.0 Mobile/15E148 Safari/604.1"
            ),
        )
        page = await ctx.new_page()
        await page.goto(f"{BASE_URL}/mobile/login", wait_until="networkidle")
        await page.fill('input[type="text"], [data-testid="input-username"]', USERNAME)
        await page.fill('input[type="password"]', PASSWORD)
        await page.click('button[type="submit"], [data-testid="button-login"]')
        try:
            await page.wait_for_url(lambda u: "/login" not in u, timeout=15000)
        except Exception:
            pass
        await page.wait_for_load_state("networkidle")
        print("login ok at", page.url, flush=True)
        await page.close()

        for slug, path in MOBILE_PAGES:
            page = await ctx.new_page()
            try:
                await page.goto(f"{BASE_URL}{path}", wait_until="networkidle", timeout=45000)
            except Exception as e:
                print("goto err:", e, flush=True)
            await page.wait_for_timeout(2500)
            try:
                await page.wait_for_function(
                    "() => document.querySelectorAll('.animate-pulse').length === 0",
                    timeout=8000,
                )
            except Exception:
                pass
            await page.wait_for_timeout(800)
            out = OUT_DIR / f"{slug}.png"
            await page.screenshot(path=str(out), full_page=False)
            print("saved", out, flush=True)
            await page.close()

        await ctx.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
