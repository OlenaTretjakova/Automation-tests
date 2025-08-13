import { browser } from '@wdio/globals';
import LoginPage from '../pageobjects/LoginPage.js';

export async function loginUser(username, password) {
    await LoginPage.open();
    await LoginPage.login(username, password);
}

export async function closeAllWindowsExceptMain() {
    const handles = await browser.getWindowHandles();
    for (let i = 1; i < handles.length; i++) {
        await browser.switchToWindow(handles[i]);
        await browser.closeWindow();
    }
    await browser.switchToWindow(handles[0]);
}

export function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
