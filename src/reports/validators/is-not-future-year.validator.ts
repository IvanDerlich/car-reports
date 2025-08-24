import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotFutureYear(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentYear = new Date().getFullYear();
          return typeof value === 'number' && value <= currentYear;
        },
        defaultMessage() {
          return `Year cannot be greater than ${new Date().getFullYear()}`;
        },
      },
    });
  };
}
