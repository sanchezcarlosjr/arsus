import * as moment from 'moment';

export class StringObject {
  protected id = '';

  constructor(...values: string[]) {
    this._value = values[0];
  }

  protected _value = '';

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
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
