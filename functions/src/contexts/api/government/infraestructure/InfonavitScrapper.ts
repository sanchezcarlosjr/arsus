import { config } from 'firebase-functions';
import puppeteer from 'puppeteer-extra';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: config().captcha2.key
        },
        visualFeedback: false
    })
)

enum InfonavitPage {
    URL = 'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CI',
    INPUT_NSS = '//*[@id="precalif:nssTitular"]',
    INPUT_BIRTHDAY = '//*[@id="precalif:fechaTitular"]',
    DIV_ERROR_CAPTCHA = '/html/body/div[3]/div[2]/form/div[1]/div',
    SUBMIT = '/html/body/div[3]/div[2]/form/div[2]/div/div[2]/table[2]/tbody/tr[2]/td/button',
    MODAL_SPAN_NAME = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[2]/td[2]/span',
    MODAL_SPAN_ERROR = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[3]/td/span'
}

export class PersonWithoutCreditError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class CaptchaError extends Error {
    constructor() {
        super("invalid security social number or birthday");
    }
}

interface Handler {
    handle: (page: Page) => Promise<void>;
}

class Home implements Handler {
    constructor(private securitySocialNumber: string, private birthday: string) { }
    async handle(page: Page) {
        const nss = await page.$x(InfonavitPage.INPUT_NSS);
        await page.evaluate(
            (elementHandler, securitySocialNumber) => elementHandler.value = securitySocialNumber,
            nss[0], this.securitySocialNumber
        );
        const day = await page.$x(InfonavitPage.INPUT_BIRTHDAY);
        await page.evaluate((elementHandler, birthday) => elementHandler.value = birthday, day[0], this.birthday);
        await (page as any).solveRecaptchas();
        const submit = await page.$x(InfonavitPage.SUBMIT);
        await Promise.all([
            page.waitForNavigation(),
            submit[0].click()
        ])
        if ((await page.$x(InfonavitPage.DIV_ERROR_CAPTCHA))[0]) {
            throw new CaptchaError();
        }
    }
}

class ModalError implements Handler {
    async handle(page: Page) {
        page.screenshot({ path: 'screenshot.png' });
        const spanError = await page.$x("/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[3]/td")
        const innerText = await spanError[0].getProperty('innerText');
        console.log(innerText.jsonValue());
        page.screenshot({ path: 'screenshot.png' });
    }
}

export class InfonavitScrapper {
    async find(securitySocialNumber: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
        const middlewares = [new Home(securitySocialNumber.value, birthday.value), new ModalError()];
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(InfonavitPage.URL);
        await Promise.all(middlewares.map((middleware) => middleware.handle(page)));
        browser.close();
        return null;
    }
}