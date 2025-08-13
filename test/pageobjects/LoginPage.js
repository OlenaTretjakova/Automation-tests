import { $ } from '@wdio/globals';

class LoginPage {
    // Selectors
    get usernameInput() { return $('#user-name'); }
    get passwordInput() { return $('#password'); }
    get loginButton() { return $('#login-button'); }
    get errorMessage() { return $('[data-test="error"]'); }

    // Actions
    async open() {
        await browser.url('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        await this.errorMessage.waitForDisplayed({ timeout: 5000 });
        return await this.errorMessage.getText();
    }

    async isErrorMessageDisplayed() {
        return await this.errorMessage.isDisplayed();
    }
}

export default new LoginPage();
