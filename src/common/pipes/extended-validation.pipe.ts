import {
    ArgumentMetadata,
    Injectable,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_VALIDATE_KEY } from '../decorators/no-validate.decorator';

/**
 * ExtendedValidationPipe is the global validation pipe used across the entire application.
 *
 * This class extends NestJS's built-in `ValidationPipe` to provide an additional feature:
 * the ability to skip validation for specific classes by decorating them with the custom `@NoValidate()` decorator.
 * 
 * This allows fine-grained control over which classes should be validated, while maintaining
 * strict validation globally elsewhere in the application.
 *
 * @example
 * 
 * @NoValidate()
 * export class CreateRawObjectDTO { ... }
 *
 * @param reflector - Used to retrieve metadata set by custom decorators.
 */
@Injectable()
export class ExtendedValidationPipe extends ValidationPipe {
    constructor(private readonly reflector: Reflector) {
        super({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
                excludeExtraneousValues: false,
            },
            validateCustomDecorators: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        const metatype = metadata.metatype;

        if (metatype && this.reflector.get<boolean>(NO_VALIDATE_KEY, metatype)) {
            // Skip validation
            return value;
        }

        return super.transform(value, metadata);
    }
}