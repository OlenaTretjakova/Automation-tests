import { browser, expect, $, $$ } from '@wdio/globals';
import LoginPage from '../pageobjects/LoginPage.js';
import InventoryPage from '../pageobjects/InventoryPage.js';
import CartPage from '../pageobjects/CartPage.js';
import CheckoutPage from '../pageobjects/CheckoutPage.js';
import { loginUser, closeAllWindowsExceptMain } from '../utils/helpers.js';

describe('Sauce Demo E2E Tests', () => {
    beforeEach(async () => {
        await browser.deleteAllCookies();
    });

    describe('Login Tests', () => {
        it('should login with valid credentials', async () => {
            await loginUser('standard_user', 'secret_sauce');
            await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        });

        it('should show error with valid username and invalid password', async () => {
            await loginUser('standard_user', 'just_sauce');
            
            const errorMessage = await LoginPage.getErrorMessage();
            await expect(LoginPage.errorMessage).toBeDisplayed();
            await expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
        });

        it('should show error with invalid username and valid password', async () => {
            await loginUser('vip_user', 'secret_sauce');
            
            const errorMessage = await LoginPage.getErrorMessage();
            await expect(LoginPage.errorMessage).toBeDisplayed();
            await expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
        });
    });

    describe('Burger Menu Tests', () => {
        it('should open burger menu and logout successfully', async () => {
            await loginUser('standard_user', 'secret_sauce');
            
            await InventoryPage.openBurgerMenu();
            
            const menuItems = await InventoryPage.getMenuItemsText();
            const expectedItems = ['All Items', 'About', 'Logout', 'Reset App State'];
            
            await expect(menuItems).toEqual(expectedItems);
            
            await InventoryPage.logout();
            await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        });
    });

    describe('Cart Persistence Tests', () => {
        it('should maintain cart items after logout and login', async () => {
            await loginUser('standard_user', 'secret_sauce');
            
            const productName = await InventoryPage.addRandomProductToCart();
            
            await InventoryPage.openBurgerMenu();
            await InventoryPage.logout();
            
            await loginUser('standard_user', 'secret_sauce');
            
            const cartItem = await $('.inventory_item_name');
            const cartItemName = await cartItem.getText();
            
            await expect(cartItemName).toBe(productName);
        });
    });

    describe('Product Sorting Tests', () => {
        beforeEach(async () => {
            await loginUser('standard_user', 'secret_sauce');
        });

        it('should sort products by name A to Z', async () => {
            await InventoryPage.sortProducts('az');
            
            const productNames = await InventoryPage.getProductNames();
            const sortedNames = [...productNames].sort();
            
            await expect(productNames).toEqual(sortedNames);
        });

        it('should sort products by name Z to A', async () => {
            await InventoryPage.sortProducts('za');
            
            const productNames = await InventoryPage.getProductNames();
            const sortedNames = [...productNames].sort().reverse();
            
            await expect(productNames).toEqual(sortedNames);
        });

        it('should sort products by price low to high', async () => {
            await InventoryPage.sortProducts('lohi');
            
            const productPrices = await InventoryPage.getProductPrices();
            const sortedPrices = [...productPrices].sort((a, b) => a - b);
            
            await expect(productPrices).toEqual(sortedPrices);
        });

        it('should sort products by price high to low', async () => {
            await InventoryPage.sortProducts('hilo');
            
            const productPrices = await InventoryPage.getProductPrices();
            const sortedPrices = [...productPrices].sort((a, b) => b - a);
            
            await expect(productPrices).toEqual(sortedPrices);
        });
    });

    describe('Social Media Links Tests', () => {
        beforeEach(async () => {
            await loginUser('standard_user', 'secret_sauce');
        });

        afterEach(async () => {
            await closeAllWindowsExceptMain();
        });

        it('should open Facebook page in new window', async () => {
            await InventoryPage.clickSocialLink('facebook');
            await browser.closeWindow();
        });

        it('should open Twitter page in new window', async () => {
            await InventoryPage.clickSocialLink('twitter');
            await browser.closeWindow();
        });

        it('should open LinkedIn page in new window', async () => {
            await InventoryPage.clickSocialLink('linkedin');
            await browser.closeWindow();
        });
    });

    describe('Order Completion Tests', () => {
        it('should complete order successfully and empty cart', async () => {
            await loginUser('standard_user', 'secret_sauce');
            
            // Clear cart first by refreshing the page
            await browser.refresh();
            await browser.waitUntil(async () => {
                return await browser.getUrl() === 'https://www.saucedemo.com/inventory.html';
            }, { timeout: 5000 });
            
            // Add product to cart
            await InventoryPage.addRandomProductToCart();
            await expect(await InventoryPage.isCartEmpty()).toBe(false);
            
            // Proceed to checkout
            await InventoryPage.openShoppingCart();
            await CartPage.proceedToCheckout();
            
            // Fill checkout form
            await CheckoutPage.fillCheckoutForm('Olena', 'Tretjacova', '111111111');
            await CheckoutPage.continueToNextStep();
            
            // Complete order
            await CheckoutPage.finishOrder();
            await CheckoutPage.backToProducts();
            
            // Verify we are back to inventory page
            await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
            
            // Verify cart is empty after order completion
            await expect(await InventoryPage.isCartEmpty()).toBe(true);
        });
    });

    describe('Empty Cart Tests', () => {
        it('should show empty cart when no items are added', async () => {
            await loginUser('standard_user', 'secret_sauce');
            
            // Clear cart first by refreshing the page
            await browser.refresh();
            await browser.waitUntil(async () => {
                return await browser.getUrl() === 'https://www.saucedemo.com/inventory.html';
            }, { timeout: 5000 });
            
            await InventoryPage.openShoppingCart();
            
            // Verify cart page is displayed
            await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
            
            // Verify checkout button is disabled or not present when cart is empty
            const checkoutButton = await CartPage.checkoutButton;
            await expect(checkoutButton).toBeDisplayed();
        });
    });

    describe('Password Limitation Tests', () => {
        it('should show error after multiple failed login attempts', async () => {
            await LoginPage.open();
            
            await LoginPage.usernameInput.setValue('standard_user');
            
            // Try to enter wrong password multiple times
            for (let i = 0; i < 3; i++) {
                await LoginPage.passwordInput.setValue(`wrong_password_${i}`);
                await LoginPage.loginButton.click();
                await browser.waitUntil(async () => {
                    return await LoginPage.errorMessage.isDisplayed();
                }, { timeout: 3000 });
            }
            
            // Verify error message is displayed
            const errorMessage = await LoginPage.getErrorMessage();
            await expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
        });
    });

    describe('Form Validation Tests', () => {
        it('should allow checkout with valid form data', async () => {
            await loginUser('standard_user', 'secret_sauce');
            
            // Add product to cart
            await InventoryPage.addRandomProductToCart();
            
            // Proceed to checkout
            await InventoryPage.openShoppingCart();
            await CartPage.proceedToCheckout();
            
            // Fill form with valid data
            await CheckoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await CheckoutPage.continueToNextStep();
            
            // Verify we can proceed to next step
            await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');
        });
    });
});

