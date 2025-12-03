import { test, expect } from "@playwright/test";

test("User can navigate to schemes and check eligibility", async ({ page }) => {
    // 1. Go to home page
    await page.goto("/");
    await expect(page).toHaveTitle(/SolarGov CG/);

    // 2. Check eligibility on home page
    await page.selectOption('select[aria-label="Applicant Type"]', "household"); // Assuming aria-label added or by label
    // Note: In real test, we'd use robust locators. Here using text/labels.
    await page.fill('input[placeholder="e.g. 500"]', "600");
    await page.fill('input[placeholder="e.g. 2000"]', "2500");
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Check Eligibility")');

    await expect(page.locator("text=You are Eligible!")).toBeVisible();

    // 3. Navigate to Schemes page
    await page.click('a[href="/schemes"]');
    await expect(page).toHaveURL(/\/schemes/);
    await expect(page.locator("h1")).toContainText("Government Solar Schemes");

    // 4. Search for a scheme
    await page.fill('input[type="search"]', "Surya");
    await page.press('input[type="search"]', "Enter");

    await expect(page.locator("text=PM Surya Ghar")).toBeVisible();
});
