import { config } from 'firebase-functions';
import puppeteer from 'puppeteer-extra';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { CommandBatch } from '../application/CommandBatch';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';
import { InfonavitResponseCommand, MexicanGeneratorCommand } from './InfonavitResponseCommand';
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')


enum InfonavitPage {
    URL = 'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CI',
    URL_II = 'https://precalificaciones.infonavit.org.mx/Precalificacion/precalif.xhtml?tipoProducto=CII',
    INPUT_NSS = '//*[@id="precalif:nssTitular"]',
    INPUT_BIRTHDAY = '//*[@id="precalif:fechaTitular"]',
    DIV_ERROR_CAPTCHA = '/html/body/div[3]/div[2]/form/div[1]/div',
    SUBMIT = '/html/body/div[3]/div[2]/form/div[2]/div/div[2]/table[2]/tbody/tr[2]/td/button',
    MODAL_SPAN_NAME = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[2]/td[2]/span',
    MODAL_SPAN_ERROR = '/html/body/div[3]/div[2]/form/div[5]/div[2]/table/tbody/tr[3]/td/span',
    UNAUTHORIZATION = '/html/body/div[3]/div[2]/form/div[2]/div/div/table[3]/tbody/tr[1]/td[2]/table/tbody/tr/td[3]/div/div[2]/span'
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

interface InfonavitProduct {
    scrape: (page: Page) => Promise<InfonavitResponse>;
}

export class Home implements InfonavitProduct {
    constructor(private securitySocialNumber: SecuritySocialNumber, private birthday: Birthday, private page: Page) { }
    async search() {
        const nss = await this.page.$x(InfonavitPage.INPUT_NSS);
        await this.page.evaluate(
            (elementHandler, securitySocialNumber) => elementHandler.value = securitySocialNumber,
            nss[0], this.securitySocialNumber.value
        );
        const day = await this.page.$x(InfonavitPage.INPUT_BIRTHDAY);
        await this.page.evaluate((elementHandler, birthday) => elementHandler.value = birthday, day[0], this.birthday.value);
        await (this.page as any).solveRecaptchas();
        await this.click(InfonavitPage.SUBMIT);
        if ((await this.page.$x(InfonavitPage.DIV_ERROR_CAPTCHA))[0]) {
            throw new CaptchaError();
        }
        const personWithoutCreditError = await this.getTextFrom(InfonavitPage.MODAL_SPAN_ERROR);
        let mexicanName = await this.getTextFrom(InfonavitPage.MODAL_SPAN_NAME);
        if (personWithoutCreditError) {
            if (/no corresponde a la registrada/.test(personWithoutCreditError)) {
                throw new Error(personWithoutCreditError);
            }
            if (personWithoutCreditError) {
                return null;
            }
            CommandBatch.getInstance().addCommand(new MexicanGeneratorCommand(mexicanName, this.birthday, this.securitySocialNumber));
            return {
                error: personWithoutCreditError.toLowerCase().trim()
            }
        }
        (await this.page.$x(InfonavitPage.UNAUTHORIZATION))[0].click();
        await this.click('/html/body/div[3]/div[2]/form/div[2]/div/div/table[5]/tbody/tr/td/button');
        mexicanName = await this.getTextFrom('/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[1]/tbody/tr/td[4]/strong');
        CommandBatch.getInstance().addCommand(new MexicanGeneratorCommand(mexicanName, this.birthday, this.securitySocialNumber));
        return await this.mapResponse();
    }
    async scrape() {
        await this.page.goto(InfonavitPage.URL);
        return
    }
    private async mapResponse() {
        const xPaths = [
            '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[4]/td[3]',
            '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[5]/td[3]',
            '/html/body/div[3]/div[2]/form[1]/div[2]/div/div/table[2]/tbody/tr[6]/td[3]',
            '//*[@id="result:descuentoMensualAux"]',
            '//*[@id="result:descuentoEcoAux"]'
        ];
        const promises = await Promise.all(xPaths.map((url) => this.getTextFrom(url)));
        promises.push(await this.getTextFrom('//*[@id="result:montoCreditoAux"]', 'value'));
        const response = promises.map((value) => Number(value.replace(',', '')));
        return {
            creditFromInfonavit: response[5],
            housingSubAccountBalance: response[0],
            operatingExpenses: response[1],
            total: response[2],
            monthlySalaryDiscount: response[3],
            creditForEcotechnologies: response[4],
            product: 'CI'
        };
    }
    async click(xPath: string) {
        const element = await this.page.$x(xPath);
        await Promise.all([
            this.page.waitForNavigation(),
            element[0].click()
        ])
    }
    async getTextFrom(xPath: string, property = 'innerText'): Promise<string> {
        const spanElement = await this.page.$x(xPath);
        if (!spanElement[0]) {
            return '';
        }
        return await (await spanElement[0].getProperty(property)).jsonValue() as string;
    }
}

export class PageCreator {
    private static instance: PageCreator = null;
    private constructor(private page: Page) {
    }
    private static async launch(url: string) {
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: '2captcha',
                    token: config().captcha2.key
                },
                visualFeedback: false
            })
        )
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
                "--proxy-server='direct://'",
                '--proxy-bypass-list=*',
                '--deterministic-fetch',
            ],
        });
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        );
        await page.setViewport({ width: 1680, height: 1050 });
        await page.goto(url);
        return page;
    }
    static async getInstance(url: string) {
        if (PageCreator.instance === null) {
            const page = await PageCreator.launch(url);
            PageCreator.instance = new PageCreator(page);
        }
        return PageCreator.instance;
    }
    getPage() {
        return this.page;
    }
}

export class InfonavitScrapper {
    async find(securitySocialNumber: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
        const pageCreator = await PageCreator.getInstance(InfonavitPage.URL);
        const home = new Home(securitySocialNumber, birthday, pageCreator.getPage());
        const response = await home.scrape();
        CommandBatch.getInstance().addCommand(new InfonavitResponseCommand(securitySocialNumber));
        return response;
    }
}