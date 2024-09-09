import { test, expect } from '@playwright/test';

test('TC001 - Successful Product Purchase', async ({ page }) => {

    // 1. Navigate to the website: https://www.demoblaze.com/index.html
    await page.goto('https://www.demoblaze.com/index.html');
    const title = await page.title();
    expect(title).toBe('STORE');

    // 2. Select the product from the Phone category list and adding to the cart.
    await page.click('a:has-text("Samsung galaxy s6")')
    await page.click('a:has-text("Add to cart")');

    // Listen for the alert dialog and dismiss it
    page.on('dialog', async dialog => {
        // console.log(await dialog.message());  // Prints the message in the alert
        await dialog.dismiss();         // Dismiss the alert
    });
    await page.waitForTimeout(1000)

    // 3. Return to the Home page and select a product from the Laptops category list and adding to the cart.
    await page.click('a:has-text("Home")');
    await page.click('a[id="itemc"][onclick="byCat(\'notebook\')"]');
    await page.click('a:has-text("Sony vaio i5")')
    await page.click('a:has-text("Add to cart")');
    await page.evaluate(() => alert('This is an alert!'));
    await page.waitForTimeout(1000)

    // 4. Return to the Home page and select a product from the Monitor category list and adding to the cart.
    await page.click('a:has-text("Home")');
    await page.click('a[id="itemc"][onclick="byCat(\'monitor\')"]');
    await page.click('a:has-text("Apple monitor 24")')
    await page.click('a:has-text("Add to cart")');
    await page.evaluate(() => alert('This is an alert!'));
    await page.waitForTimeout(1000);

    // 5. Navigate to the Cart.
    await page.click('a:has-text("Cart")');
    await page.waitForTimeout(1000);

    let price1 = await page.locator('//tbody[@id="tbodyid"]//tr[1]//td[3]').innerText();
    let price2 = await page.locator('//tbody[@id="tbodyid"]//tr[2]//td[3]').innerText();
    let price3 = await page.locator('//tbody[@id="tbodyid"]//tr[3]//td[3]').innerText();
    let total = parseInt(price1) + parseInt(price2) + parseInt(price3);
    let element = await page.locator('//h3[@id="totalp"]').innerText();
    await expect(total).toBe(parseInt(element));


    // 6. Deleteete  last product fromm thelist.
    await page.click('//tbody[@id="tbodyid"]//tr[3]//td[4]//a');
    await page.waitForTimeout(1000);

    // 7. Clickck th"Place Order" button.
    price1 = await page.locator('//tbody[@id="tbodyid"]//tr[1]//td[3]').innerText();
    price2 = await page.locator('//tbody[@id="tbodyid"]//tr[2]//td[3]').innerText();
    total = parseInt(price1) + parseInt(price2);
    element = await page.locator('//h3[@id="totalp"]').innerText();
    await expect(total).toBe(parseInt(element));
    await page.click('//button[@class="btn btn-success"]');

    // 8. Fill in the all information and click the "Purchase" button.
    await page.fill('input[id="name"]', 'John Doe');
    await page.fill('input[id="country"]', 'United States');
    await page.fill('input[id="city"]', 'New York');
    await page.fill('input[id="card"]', '1234567890123456');
    await page.fill('input[id="month"]', '12');
    await page.fill('input[id="year"]', '2023');
    await page.click('//button[@onclick="purchaseOrder()"]');
    await page.waitForTimeout(1000)

    const header = await page.locator('//div[@class="sweet-alert  showSweetAlert visible"]//h2').innerText();
    const message = await page.locator('//div[@class="sweet-alert  showSweetAlert visible"]//p').innerText()

    expect(header).toEqual('Thank you for your purchase!'); 
    expect(message).toContain('Amount: 1190 USD');
    expect(message).toContain('Card Number: 1234567890123456');
    expect(message).toContain('Name: John Doe');





    

// 9. Click "Close" the window.
    // await page.close();
});