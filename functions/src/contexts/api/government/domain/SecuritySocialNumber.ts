import { StringObject } from '../../../../helpers/StringObject';

export class BadSecuritySocialNumberFormat extends Error {
    constructor(nss: string) {
        super(`'${nss}' is a invalid security social number`);
    }
}

export class SecuritySocialNumber extends StringObject {
    constructor(nss: string) {
        super(nss);
        this.ensureSecuritySocialNumber();
    }

    private ensureSecuritySocialNumber() {
        if (!this.value) {
            throw new BadSecuritySocialNumberFormat(this.value);
        }
        const securitySocialNumber = this.value.match(/^(\d{2})(\d{2})(\d{2})\d{5}$/);
        if (!securitySocialNumber) {
            throw new BadSecuritySocialNumberFormat(this.value);
        }
        this.validateByExpression(securitySocialNumber);
        this.validateByLuhn();
    }

    private validateByExpression(securitySocialNumber: RegExpMatchArray) {
        const subDelegation = parseInt(securitySocialNumber[1], 10);
        if (subDelegation == 97) return;
        const actualYear: number = new Date().getFullYear() % 100;
        let dischargedYear = parseInt(securitySocialNumber[2], 10);
        let birthYear = parseInt(securitySocialNumber[3], 10);
        if (dischargedYear <= actualYear) dischargedYear += 100;
        if (birthYear <= actualYear) birthYear += 100;
        if (birthYear > dischargedYear)
            throw new BadSecuritySocialNumberFormat(this.value);
    }

    private validateByLuhn() {
        let sum = 0, pair = false, digit = 0;
        for (let i = this.value.length - 1; i >= 0; i--) {
            digit = parseInt(this.value.charAt(i), 10);
            if (pair && (digit *= 2) > 9) {
                digit -= 9;
            }
            pair = !pair;
            sum += digit;
        }
        if ((sum % 10) !== 0)
            throw new BadSecuritySocialNumberFormat(this.value);
    }
}
