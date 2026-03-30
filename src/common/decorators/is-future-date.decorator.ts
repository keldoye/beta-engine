import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return true; // Skip validation if value is not provided (use @IsOptional() if needed)
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time part to start of day
                    return date >= today;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a date greater than or equal to today`;
                },
            },
        });
    };
} 