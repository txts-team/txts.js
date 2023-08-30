import {JSDOM} from "jsdom";
import {fetch, CookieJar} from "node-fetch-cookies";

const cookieJar = new CookieJar();
export class txtsClient {
    constructor(url) {
        this.url = url;
    }

    async #fetchPage(username) {
        try {
            const response = await fetch(cookieJar,`${this.url}/@${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = await response.text();
            const jsdom = new JSDOM(html);
            return jsdom.window.document;
        } catch (error) {
            console.log(`Could not fetch page:\n ${error}`);
            return null;
        }
    }
    async #fetchEditPage(username) {
        try {
            const response = await fetch(cookieJar,`${this.url}/@${username}/edit`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = await response.text();
            const jsdom = new JSDOM(html);
            return jsdom.window.document;
        } catch (error) {
            console.log(`Could not fetch edit page, are you sure that the user exists?\n ${error}`);
            return null;
        }
    }
    async getTxt(username) {
        const document = await this.#fetchPage(username);
        if (document) {
            const primaryContainer = document.querySelector(".primary-container");
            if (primaryContainer) {
                primaryContainer.querySelectorAll('header, div').forEach(el => el.remove());
                return primaryContainer.innerHTML;
            } else {
                console.warn("Warning: .primary-container not found.");
                return null;
            }
        }
        return null;
    }

    async isVerified(username) {
        const document = await this.#fetchPage(username);
        if (document) {
            return !!document.querySelector(".verified-icon");
        }
        return false;
    }
    async editTxt(username, secret, content) {
        const document = await this.#fetchEditPage(username);
        if (document) {
            const tokenElem = document.querySelector('input[name="__RequestVerificationToken"]');
            if (!tokenElem) {
                console.warn("Warning: __RequestVerificationToken not found.");
                return false;
            }
            const tokenValue = tokenElem.value;

            try {
                const response = await fetch(cookieJar,`${this.url}/@${username}/edit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Origin": this.url,
                        "Referer": `${this.url}/@${username}/edit`
                    },
                    body: new URLSearchParams({
                        "__RequestVerificationToken": tokenValue,
                        "content": content,
                        "secret": secret
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return true; // Successfully edited the page

            } catch (error) {
                console.log(`Could not edit page:\n ${error}`);
                return false;
            }
        }
        return false;
    }
}