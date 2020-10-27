import * as moment from "moment";

export class StringObject {
  protected readonly _value: string = '';

  constructor(...values: string[]) {
    this._value = values[0];
  }

  get value() {
    return this._value;
  }
}

export class DateObject {
  protected readonly _value: string = '';

  constructor(value: string, format: string) {
    this._value = moment(value).add(1, 'days').format(format);
  }

  get value() {
    return this._value;
  }
}