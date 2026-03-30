import { SetMetadata } from '@nestjs/common';

export const NO_VALIDATE_KEY = 'no-validate';
/**
 * This decorator is used to skip validation for a specific class.
 * It is used to skip the global validation pipe.
 * @returns {SetMetadata}
 * @example
 * @NoValidate()
 * class MyClass {
 *   name: string;
 * }
 */
export const NoValidate = () => SetMetadata(NO_VALIDATE_KEY, true);