import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class QueryValidationPipe extends ValidationPipe {
    constructor(allowedFields: string[]) {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const nonWhitelistedErrors = errors.filter(
                    error => error.constraints && error.constraints.whitelistValidation
                );

                if (nonWhitelistedErrors.length > 0) {
                    const invalidProps = nonWhitelistedErrors.map(error => error.property);
                    return new BadRequestException(
                        `Invalid query parameters: ${invalidProps.join(', ')}. Allowed parameters are: ${allowedFields.join(', ')}`
                    );
                }
                return new BadRequestException(errors);
            }
        });
    }
} 