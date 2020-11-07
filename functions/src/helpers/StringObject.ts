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
  protected readonly _originalValue: string = '';

  constructor(value: string, format: string) {
    this._originalValue = value;
    this._value = moment.utc(value).format(format);
  }

  get value() {
    return this._value;
  }
  get originalValue() {
    return new Date(this._originalValue);
  }
}