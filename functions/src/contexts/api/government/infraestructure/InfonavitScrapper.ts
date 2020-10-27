import { config } from 'firebase-functions';
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer-extra/dist/puppeteer';
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
    DIV_ERROR_INPUT = '/html/body/div[3]/div[2]/form/div[1]/div',
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
        super("could not solve captcha");
    }
}

abstract class Handler {
    protected page: Page;
    protected browser: Browser;
    private next: Handler;
    setNext(handler: Handler) {
        this.next = handler;
    }
    async handle(): Promise<void> {
        if (this.next) {
            await this.next.handle();
        }
    }
}

class Home extends Handler {
    constructor(private securitySocialNumber: string, private birthday: string) {
        super();
    }
    async handle() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
        await this.page.goto(InfonavitPage.URL);
        const nss = await this.page.$x(InfonavitPage.INPUT_NSS);
        await this.page.evaluate(
            (elementHandler, securitySocialNumber) => elementHandler.value = securitySocialNumber,
            nss[0], this.securitySocialNumber
        );
        const day = await this.page.$x(InfonavitPage.INPUT_BIRTHDAY);
        await this.page.evaluate((elementHandler, birthday) => elementHandler.value = birthday, day[0], this.birthday);
        await (this.page as any).solveRecaptchas();
        const submit = await this.page.$x(InfonavitPage.SUBMIT);
        await Promise.all([
            this.page.waitForNavigation(),
            submit[0].click()
        ])
        let error = await this.page.$x(InfonavitPage.DIV_ERROR_INPUT);
        if (error[0]) {
            throw new CaptchaError();
        }
        super.handle();
    }
}

class ModalError extends Handler {
    async handle() {
        const spanError = await this.page.$x(InfonavitPage.MODAL_SPAN_ERROR)
        const textContent = await (await spanError[0].getProperty('textContent')).jsonValue();
        if (textContent) {
            console.log(textContent);
            throw new PersonWithoutCreditError("");
        }
        super.handle();
    }
}

export class InfonavitScrapper {
    async find(securitySocialNumber: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
        const home = new Home(securitySocialNumber.value, birthday.value);
        const modal = new ModalError();
        home.setNext(modal);
        home.handle();
        return null;
    }
}