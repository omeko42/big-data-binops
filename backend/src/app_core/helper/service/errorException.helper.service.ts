import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('ErrorExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';
        let systemMessage: any[] = [];
        let errorDetails: any = {};

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMessage = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message || 'Internal server error';
            errorDetails = errorResponse as any;
        } else if (exception instanceof QueryFailedError) {
            status = HttpStatus.BAD_REQUEST; // Or another suitable status code
            errorMessage = (exception.driverError && exception.driverError.constraint === 'chk_auth_users_username_format') ? 'Format Username tidak valid: gunakan 3-30 karakter huruf kecil, angka, titik (.), atau garis bawah (_) tanpa @domain.' : (exception.driverError && exception.driverError.code === 'P0001' && exception.driverError.message ? exception.driverError.message : (exception.driverError && exception.driverError.detail ? 'Gagal menyimpan ke database: ' + exception.driverError.detail : 'Database query failed'));
            const errorCode = exception.driverError?.code;
            systemMessage = [
                `Error Code: ${errorCode || 'DB_QUERY_ERROR'}`
            ];
            errorDetails = {
                detail: exception.driverError.detail,
                code: exception.driverError.code,
                constraint: exception.driverError.constraint
            };
        } else {
            const defaultErrorMessage = 'Unexpected error occurred';
            if (exception instanceof Error) {
                errorMessage = exception.message;
            } else if (typeof exception === 'string') {
                errorMessage = exception;
            } else if (exception && typeof exception === 'object' && 'message' in exception) {
                errorMessage = (exception as any).message || defaultErrorMessage;
            } else {
                errorMessage = defaultErrorMessage;
            }
            systemMessage.push('Unhandled exception:', errorMessage);
        }
        const formattedError = {
            status: 0,
            statusCode: status,
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
            path: request.route?.path,
            method: request.route?.methods,
            message: errorMessage,
            system_message: systemMessage, // Include system messages for debugging
            errors: (errorDetails.errors && Object.keys(errorDetails.errors).length > 0) ? errorDetails.errors : (errorMessage ? { _general: [errorMessage] } : {}), // Safe access to properties
            data: errorDetails.data || [] // Safe access to properties
        };

        // WAJIB dicatat -- exception di sini dibalas sbg HTTP 200 (lihat bawah), jadi tanpa log ini
        // TIDAK ADA JEJAK SAMA SEKALI di server kalau suatu endpoint gagal (pernah kejadian nyata:
        // bug SQL di SatkerLegacyReconciliationService bikin halaman diam2 nampilin data kosong
        // tanpa error apapun, nyaris mustahil dilacak sampai ditambah log manual). HttpException
        // biasa (validasi/guard, mis. BadRequestException) di-warn -- biasanya memang disengaja
        // (pesan utk user). QueryFailedError/exception lain di-error -- itu bug sungguhan.
        const path = `${request.method} ${request.originalUrl || request.url}`;
        if (exception instanceof HttpException) {
            const errDetail = errorDetails.errors && Object.keys(errorDetails.errors).length ? ` | errors: ${JSON.stringify(errorDetails.errors)}` : '';
            this.logger.warn(`${path} -> ${status} ${errorMessage}${errDetail}`);
        } else {
            this.logger.error(`${path} -> ${errorMessage}`, exception instanceof Error ? exception.stack : undefined);
        }

        // response.status(status).json(formattedError);
        if (errorDetails.errors?.session_fixation) {
            Object.keys(request.cookies).forEach(cookie => {
                response.clearCookie(cookie); // Ensure clearCookie is called for each cookie
            });
            response.status(403).json(formattedError);
        } else {
            response.status(200).json(formattedError);
        }
    }
}
