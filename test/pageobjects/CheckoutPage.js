import { $ } from '@wdio/globals';

class CheckoutPage {
    // Selectors
    get firstNameInput() { return $('#first-name'); }
    get lastNameInput() { return $('#last-name'); }
    get postalCodeInput() { return $('#postal-code'); }
    get continueButton() { return $('#continue'); }
    get finishButton() { return $('#finish'); }
    get backToProductsButton() { return $('#back-to-products'); }
    get warningMessage() { return $('.warning_enter_message'); }

    // Actions
    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.firstNameInput.setValue(firstName);
        await this.lastNameInput.setValue(lastName);
        await this.postalCodeInput.setValue(postalCode);
    }

    async continueToNextStep() {
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }

    async backToProducts() {
        await this.backToProductsButton.click();
    }

    async getWarningMessage() {
        await this.warningMessage.waitForExist({ timeout: 3000 });
        return await this.warningMessage.getText();
    }

    async isWarningDisplayed() {
        return await this.warningMessage.isDisplayed();
    }
}

export default new CheckoutPage();
