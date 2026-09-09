import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { AppException, ErrorSeverity } from "./app.exception";

@Catch(AppException)
export class GlobalWsExceptionFilter
    extends BaseWsExceptionFilter
    {
    catch(
        exception: unknown,
        host: ArgumentsHost,
    ) {
        if (exception instanceof AppException) {
        this.logException(exception);

        const response: Record<string, unknown> = {
            code: exception.code,
            severity: exception.severity,
            message: exception.message,
        };

        if (exception.clientData !== undefined) {
            response.data = exception.clientData;
        }

    return super.catch(
        new WsException(response),
        host,
        );
    }

    console.error(
        'UNHANDLED WEBSOCKET ERROR',
        exception,
    );

    return super.catch(new WsException({
        code: 'INTERNAL_ERROR',
        severity: ErrorSeverity.ERROR,
        message: 'An unexpected error occurred',
        }),
        host,
        );
    }

    private logException(exception: AppException,) {
        console.error({
        error: exception.message,
        code: exception.code,
        severity: exception.severity,
        context: exception.context,
        details: exception.details,
        stack: exception.stack,
        });
    }
}