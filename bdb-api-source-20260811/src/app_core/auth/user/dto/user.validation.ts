import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Custom constraint logic
@ValidatorConstraint({ name: 'IsEmailMatchNRP', async: false })
export class IsEmailMatchNRPConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
        const object: any = args.object;
        return typeof object.nrp === 'string' && email === `${object.nrp}@polri.go.id`;
    }

    defaultMessage(args: ValidationArguments) {
        return `Email harus sesuai format <nrp>@polri.go.id`;
    }
}

// Decorator function
export function IsEmailMatchNRP(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailMatchNRPConstraint
        });
    };
}
