export class Email {
  private _value: string;

  constructor(value: string) {
    if (!this.validate(value)) {
      throw new Error('Email inválido.');
    }
    this._value = value;
  }

  private validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  getValue(): string {
    return this._value;
  }
}
