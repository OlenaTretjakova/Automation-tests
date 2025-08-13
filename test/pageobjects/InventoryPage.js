import { $, $$ } from '@wdio/globals';

class InventoryPage {
    // Selectors
    get burgerMenuButton() { return $('#react-burger-menu-btn'); }
    get burgerMenu() { return $('.bm-menu'); }
    get menuItems() { return $$('.menu-item'); }
    get logoutLink() { return $('#logout_sidebar_link'); }
    get productCards() { return $$('.inventory_item'); }
    get addToCartButtons() { return $$('.btn_inventory'); }
    get shoppingCartBadge() { return $('.shopping_cart_badge'); }
    get shoppingCartLink() { return $('.shopping_cart_link'); }
    get sortDropdown() { return $('.right_component'); }
    get facebookLink() { return $('.social_facebook'); }
    get twitterLink() { return $('.social_twitter'); }
    get linkedinLink() { return $('.social_linkedin'); }

    // Actions
    async openBurgerMenu() {
        await this.burgerMenuButton.click();
        await this.burgerMenu.waitForDisplayed({ timeout: 5000 });
    }

    async logout() {
        await this.logoutLink.click();
    }

    async getMenuItemsText() {
        const items = await this.menuItems;
        const texts = [];
        for (const item of items) {
            texts.push(await item.getText());
        }
        return texts;
    }

    async addRandomProductToCart() {
        const cards = await this.productCards;
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards[randomIndex];
        const productName = await card.$('.inventory_item_name').getText();
        await card.$('.btn_inventory').click();
        return productName;
    }

    async getProductNames() {
        const cards = await this.productCards;
        const names = [];
        for (const card of cards) {
            names.push(await card.$('.inventory_item_name').getText());
        }
        return names;
    }

    async getProductPrices() {
        const cards = await this.productCards;
        const prices = [];
        for (const card of cards) {
            const priceText = await card.$('.inventory_item_price').getText();
            const price = parseInt(priceText.replace('$', ''));
            prices.push(price);
        }
        return prices;
    }

    async sortProducts(sortValue) {
        await this.sortDropdown.click();
        await $(`[value="${sortValue}"]`).click();
    }

    async openShoppingCart() {
        await this.shoppingCartLink.click();
    }

    async isCartEmpty() {
        try {
            return !(await this.shoppingCartBadge.isExisting());
        } catch (error) {
            return true; // If badge doesn't exist, cart is empty
        }
    }

    async clickSocialLink(linkType) {
        const handlesBefore = await browser.getWindowHandles();
        
        switch (linkType) {
            case 'facebook':
                await this.facebookLink.click();
                break;
            case 'twitter':
                await this.twitterLink.click();
                break;
            case 'linkedin':
                await this.linkedinLink.click();
                break;
        }

        await browser.waitUntil(async () => {
            const handlesAfter = await browser.getWindowHandles();
            return handlesAfter.length > handlesBefore.length;
        }, {
            timeout: 5000,
            timeoutMsg: `${linkType} page was not opened`
        });
    }
}

export default new InventoryPage();
