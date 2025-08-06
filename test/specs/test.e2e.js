import { browser, expect } from '@wdio/globals'


async function clickElement(selector) {
    const element = await $(selector);
    await element.click();
}

async function logIn(userName, password) {
    await browser.url('https://www.saucedemo.com/')

    let inputUserName = await $("#user-name")
    await inputUserName.addValue(userName)

    let inputPassword = await $("#password")
    await inputPassword.addValue(password)

    await clickElement('#login-button')

}


describe("Test tasks ", () => {

    xit("Test case 1.Log in with a valid user Name and a valid password", async () => {

        await logIn("standard_user", "secret_sauce")

        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

        await browser.pause(1000)

    });

    xit("Test case 2. Log in with a valid user name and an invalid password", async () => {

        await logIn("standard_user", "just_sauce")

        let errorMessage = await $('[data-test="error"]');

        const messageText = await errorMessage.getText();

        await expect(errorMessage).toBeDisplayed();

        await expect(messageText).toContain("Epic sadface: Username and password do not match any user in this service");

        await browser.pause(1000)
    });

    xit("Test case 3. Log in with an invalid user Name(wrong user Name) and a valid password.", async () => {

        await logIn("vip_user", "secret_sauce")

        let errorMessage = await $('[data-test="error"]')
        let messageText = await errorMessage.getText()

        await expect(errorMessage).toBeDisplayed()
        await expect(messageText).toContain("Epic sadface: Username and password do not match any user in this service");
        await browser.pause(1000)
    })

    xit("Test case 4. To open burger-menu (it consists of 4 items). To choose 'Log out' (redirect to Log in form)", async () => {

        await logIn("standard_user", "secret_sauce")

        clickElement('#react-burger-menu-btn');

        const bm_menu = await $('.bm-menu');
        await expect(bm_menu).toBeDisplayed();

        await browser.pause(1000)

        const links = await $$('.menu-item');
        expect(links.length).toBe(4);

        let expectedLinks = ['All Items', 'About', 'Logout', 'Reset App State'];

        for (let i = 0; i < links.length; i++) {
            const linkText = await links[i].getText();
            expect(linkText).toBe(expectedLinks[i]);
        }

        let logOutLink = await $('#logout_sidebar_link')
        logOutLink.click()


        await expect(browser).toHaveUrl('https://www.saucedemo.com/')

        await browser.pause(1000)

    });
    xit('Test case 5.The goods in the cart do not change after the user logs out and logs back in', async () => {

        await logIn("standard_user", "secret_sauce")

        await browser.pause(1000)

        let productCards = await $$('.inventory_container')

        let numberOfCards = await productCards.length

        const randomInt = Math.floor(Math.random() * numberOfCards);


        let card = productCards[randomInt]
        let cardTitle = await card.$('.inventory_item_name')
        let cardName = await cardTitle.getText()

        clickElement('.btn_inventory')

        clickElement('#react-burger-menu-btn')
        await browser.pause(1000)


        clickElement('#logout_sidebar_link')
        await browser.pause(1000)

        await logIn("standard_user", "secret_sauce")

        clickElement('#login-button')
        await browser.pause(1000)

        clickElement('#inventory_container')

        let goodItem = await $('.inventory_item_name')

        const goodItemName = await goodItem.getText();

        expect(goodItemName).toBe(cardName);
        await browser.pause(1000)
    });

    xit('Test case 6.1 . Sort the products Name A to Z', async () => {

        await logIn("standard_user", "secret_sauce")

        clickElement('.right_component')

        clickElement('[value="az"]')

        let productCards = await $$('.inventory_item')
        let numberOfCards = await productCards.length

        let listOfNames = []

        for (let i = 0; i < numberOfCards; i++) {
            let cardTitle = await productCards[i].$('.inventory_item_name')
            let cardName = await cardTitle.getText()
            listOfNames.push(cardName)
        }

        let controlListOfName = listOfNames.sort()

        await expect(listOfNames).toEqual(controlListOfName)

    })

    xit('Test case 6.2 . Sort the products Name Z to A', async () => {

        await logIn("standard_user", "secret_sauce")

        clickElement('.right_component')
        clickElement('[value="za"]')

        let productCards = await $$('.inventory_item')
        let numberOfCards = await productCards.length

        let listOfNames = []

        for (let i = 0; i < numberOfCards; i++) {
            let productCard = await productCards[i].$('.inventory_item_name')
            let cardName = await productCard.getText()
            listOfNames.push(cardName)
        }

        let controlListOfName = listOfNames.sort()
        let reversControlListOfName = controlListOfName.reverse()

        await expect(listOfNames).toEqual(reversControlListOfName)
    })

    xit('Test case 6.3 . Sort the price low to high', async () => {

        await logIn("standard_user", "secret_sauce")

        clickElement('.right_component')

        clickElement('[value="lohi"]')

        let productCards = await $$('.inventory_item')
        let numberOfCards = await productCards.length

        let listOfPrices = []

        for (let i = 0; i < numberOfCards; i++) {
            let cardPriceTitle = await productCards[i].$('.inventory_item_price')
            let cardpriceText = await cardPriceTitle.getText()

            let numericString = cardpriceText.replace('$', '')
            let priceNumber = parseInt(numericString);
            listOfPrices.push(priceNumber)
        }

        let controlListOfPricelehi = listOfPrices.sort((a, b) => a - b);

        await expect(listOfPrices).toEqual(controlListOfPricelehi)

    })

    xit('Test case 6.4 . Sort the price high to low', async () => {

        await logIn("standard_user", "secret_sauce")

        clickElement('.right_component')

        clickElement('[value="hilo"]')

        let productCards = await $$('.inventory_item')
        let numberOfCards = await productCards.length

        let listOfPrices = []

        for (let i = 0; i < numberOfCards; i++) {
            let cardPriceTitle = await productCards[i].$('.inventory_item_price')
            let cardpriceText = await cardPriceTitle.getText()

            let numericString = cardpriceText.replace('$', '')
            let priceNumber = parseInt(numericString);

            listOfPrices.push(priceNumber)
        }

        let controlListOfPricelehi = listOfPrices.sort((a, b) => a - b);
        let reversControlListOfPricelehi = controlListOfPricelehi.reverse()

        await expect(listOfPrices).toEqual(reversControlListOfPricelehi)
    })

    xit('Test case 7.1 . Click on the icon of facebook opens facebook`s page in a new window.', async () => {
        await logIn("standard_user", "secret_sauce")

        const handlesBefore = await browser.getWindowHandles()

        clickElement('.social_facebook')

        await browser.waitUntil(async () => {
            const handlesAfter = await browser.getWindowHandles()
            return handlesAfter.length > handlesBefore.length;
        },
            {
                timeout: 5000,
                timeoutMsg: 'Facebook`s page was not opened'
            }

        );

        await browser.pause(1000)
        await browser.closeWindow();
    })

    xit('Test case 7.2 . Click on the icon of twitter opens twitter`s page in a new window.', async () => {
        await logIn("standard_user", "secret_sauce")

        await browser.url('https://www.saucedemo.com/inventory.html')
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')
        const handlesBefore = await browser.getWindowHandles()

        let twLink = await $('.social_twitter')
        await twLink.click()
        await browser.url('https://x.com/saucelabs')
        await expect(browser).toHaveUrl('https://x.com/saucelabs')

        await browser.waitUntil(async () => {
            const handlesAfter = await browser.getWindowHandles()
            return handlesAfter.length > handlesBefore.length;
        },
            {
                timeout: 5000,
                timeoutMsg: 'The Twitter`s page was not opened'
            });

        await browser.pause(1000)
        await browser.closeWindow();

    })

    xit('Test case 7.3 . Click on the icon of linkedin opens linkedin`s page in a new window.', async () => {
        await logIn("standard_user", "secret_sauce")

        const handlesBefore = await browser.getWindowHandles()

        clickElement('.social_linkedin')

        await browser.waitUntil(async () => {
            const handlesAfter = await browser.getWindowHandles()
            return handlesAfter.length > handlesBefore.length;
        },
            {
                timeout: 5000,
                timeoutMsg: 'Linkedin was not opened'
            });

        await browser.pause(1000)
        await browser.closeWindow();

    })
    xit('Test case 8 . When an order is completed successfully, the shopping cart becomes empty..', async () => {

        await logIn("standard_user", "secret_sauce")

        browser.pause(1000)

        let numberIntoCart = await $('.shopping_cart_badge')

        await expect(await numberIntoCart.isExisting()).toBe(false)


        let productCards = await $$('.inventory_container')

        let numberOfCards = await productCards.length

        const randomInt = Math.floor(Math.random() * numberOfCards);

        let card = productCards[randomInt]

        const addToCartButton = await card.$('.btn_inventory')
        await addToCartButton.click()

        await browser.pause(2000)
        await expect(await numberIntoCart.isExisting()).toBe(true)


        clickElement('#inventory_container')
        await browser.pause(2000)

        clickElement('.shopping_cart_link')

        clickElement('#checkout')
        await browser.pause(2000)

        let inputFirstName = await $('#first-name')
        await inputFirstName.addValue('Olena')

        let inputLastName = await $('#last-name')
        await inputLastName.addValue('Tretjacova')

        let inputPost = await $('#postal-code')
        await inputPost.addValue('111111111')

        clickElement('#continue')

        clickElement('#finish')

        clickElement('#back-to-products')

        await browser.pause(2000)

        await expect(await numberIntoCart.isExisting()).toBe(false)
    })
    xit('Trying to complete an order with an empty cart is not successful; a warning about the cart being empty appears.', async () => {

        await logIn("standard_user", "secret_sauce")

        browser.pause(2000)

        let numberIntoCart = await $('.shopping_cart_badge')

        await expect(await numberIntoCart.isExisting()).toBe(false)

        await clickElement('.shopping_cart_link')
        browser.pause(2000)

        await clickElement('#checkout')


        const warning = await $('.cart-empty-message');


        await warning.waitForExist({ timeout: 3000 });


        const warningText = await warning.getText();


        try {
            expect(warningText.toLowerCase()).toContain('The cart is empty');
        } catch (err) {

            throw new Error('It is a bug.The warning isn`t showen');
        }

        browser.pause(1000)
    })
    xit('Should limit password to 5 characters', async () => {

        await browser.url('https://www.saucedemo.com/')

        let inputUserName = await $("#user-name")
        await inputUserName.addValue('standard_user')

        let inputPassword = await $("#password")
        let nubberOfTrying = 0

        while (nubberOfTrying < 5) {

            await inputPassword.addValue(nubberOfTrying)
            nubberOfTrying++
            await clickElement('#login-button')
            await browser.pause(1000)
        }

        const warning = await $('.limit_enter_message');


        await warning.waitForExist({ timeout: 3000 });


        const warningText = await warning.getText();


        try {
            expect(warningText.toLowerCase()).toContain('You have not to continue to enter password. You have already used all trying.');
        } catch (err) {

            throw new Error('It is a bug.The warning isn`t showen');
        }



    })
    it('Should allow order completion with spaces in each field', async () => {

        await logIn("standard_user", "secret_sauce")

        browser.pause(1000)

        let productCards = await $$('.inventory_container')

        let numberOfCards = await productCards.length

        const randomInt = Math.floor(Math.random() * numberOfCards);

        let card = productCards[randomInt]

        await clickElement('.btn_inventory')

        const addToCartButton = await card.$('.btn_inventory')
        await addToCartButton.click()

        await browser.pause(2000)

        await clickElement('#inventory_container')
        await browser.pause(2000)

        clickElement('.shopping_cart_link')

        clickElement('#checkout')
        await browser.pause(2000)

        let inputFirstName = await $('#first-name')
        await inputFirstName.addValue(' ')

        let inputLastName = await $('#last-name')
        await inputLastName.addValue(' ')

        let inputPost = await $('#postal-code')
        await inputPost.addValue(' ')

        clickElement('#continue')

        await browser.pause(1000)

        const warning = await $('.warning_enter_message');


        await warning.waitForExist({ timeout: 3000 });


        const warningText = await warning.getText();


        try {
            expect(warningText.toLowerCase()).toContain('Please fill in the required fields.');
        } catch (err) {

            throw new Error('It is a bug.The warning isn`t showen');
        }
    })

});

