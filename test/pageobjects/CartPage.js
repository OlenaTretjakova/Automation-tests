import { $ } from '@wdio/globals';

class CartPage {
    // Selectors
    get checkoutButton() { return $('#checkout'); }
    get cartEmptyMessage() { return $('.cart-empty-message'); }
    get cartItems() { return $$('.cart_item'); }

    // Actions
    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async getCartEmptyMessage() {
        await this.cartEmptyMessage.waitForExist({ timeout: 3000 });
        return await this.cartEmptyMessage.getText();
    }

    async isCartEmpty() {
        return await this.cartEmptyMessage.isDisplayed();
    }

    async getCartItemsCount() {
        const items = await this.cartItems;
        return items.length;
    }
}

export default new CartPage();
