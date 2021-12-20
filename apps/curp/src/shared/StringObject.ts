export class StringObject {
  id = '';

  constructor(...values: string[]) {
    this._value = values[0];
  }

  _value = '';

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
}
