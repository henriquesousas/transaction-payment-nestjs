import { FieldsErrors } from './validator-field';

export class ValidationError extends Error {
  constructor(public error: FieldsErrors[], message = 'Validation Error') {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export class Flunt {
  errors: Set<string> = new Set<string>();
  private constructor(private value: any, private property: string) {}

  static values(value: any, property: string) {
    return new Flunt(value, property);
  }

  required(): Omit<this, 'required'> {
    if (this.value === null || this.value === undefined || this.value === '') {
      throw new ValidationError([`The ${this.property} is required`]);
    }
    return this;
  }

  string(): Omit<this, 'string'> {
    if (!isEmpty(this.value) && typeof this.value !== 'string') {
      throw new ValidationError([`The ${this.property} must be a string`]);
    }
    return this;
  }

  maxLength(max: number): Omit<this, 'maxLength'> {
    if (!isEmpty(this.value) && this.value.length > max) {
      throw new ValidationError([
        `The ${this.property} must be less or equal than ${max} characters`,
      ]);
    }
    return this;
  }

  minLength(min: number): Omit<this, 'minLength'> {
    if (!isEmpty(this.value) && this.value.length < min) {
      // throw new ValidationError([
      //   `The ${this.property} must be grather or equals than ${min} characters`,
      // ]);
      this.errors.add(
        `The ${this.property} must be grather or equals than ${min} characters`,
      );
    }
    return this;
  }

  boolean(): Omit<this, 'boolean'> {
    if (!isEmpty(this.value) && typeof this.value !== 'boolean') {
      // throw new ValidationError([`The ${this.property} must be a boolean`]);
      this.errors.add(`The ${this.property} must be a boolean`);
    }
    return this;
  }
}

export function isEmpty(value: any) {
  return value === undefined || value === null;
}

// export default ValidatorRules
