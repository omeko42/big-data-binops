import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        // Log metadata and value for debugging
        // console.log('Metadata:', metadata);
        // console.log('Value:', value);

        // Check if metatype is a valid class
        if (!metadata.metatype || !this.isClass(metadata.metatype)) {
            return value; // Skip validation if metatype is not a class
        }

        // Transform plain object to class instance
        const object = plainToClass(metadata.metatype, value);
        const errors: ValidationError[] = await validate(object, {
            whitelist: true // hapus properti yang tidak ada di DTO
            // forbidNonWhitelisted: true, // lempar error kalau ada properti tidak diizinkan
            // forbidUnknownValues: true, // error jika nilai unknown
            // skipMissingProperties: false
        });

        if (errors.length > 0) {
            // Format validation errors
            const formattedErrors = errors.reduce(
                (acc, error) => {
                    const constraints = Object.values(error.constraints || {});
                    acc[error.property] = constraints;
                    return acc;
                },
                {} as Record<string, string[]>
            );

            throw new BadRequestException({
                message: 'Validation failed',
                errors: formattedErrors
            });
        }

        return value;
    }

    // Helper method to check if value is a class
    private isClass(value: any): boolean {
        return typeof value === 'function' && /^class\s/.test(Function.prototype.toString.call(value));
    }
}
