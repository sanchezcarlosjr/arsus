export class StringObject {
  private readonly _value: string = '';

  constructor(...values: string[]) {
    this._value = values[0];
  }

  get value() {
    return this._value;
  }
}
