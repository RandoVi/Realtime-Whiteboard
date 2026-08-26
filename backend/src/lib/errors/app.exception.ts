export enum ErrorSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical',
}

export enum AppErrorCode {
    NO_DATA = "NO_DATA",
    NOT_FOUND = "NOT_FOUND",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    INVALID_INPUT = "INVALID_INPUT",
    INVALID_STATE = "INVALID_STATE",
    TRANSFORMATION_FAILED = "TRANSFORMATION_FAILED",
}

export const AppErrorDefinitions = {
    [AppErrorCode.NO_DATA]: {
        message: "No data provided or unable to process",
        severity: ErrorSeverity.WARNING,
    },

    [AppErrorCode.NOT_FOUND]: {
        message: "Resource not found",
        severity: ErrorSeverity.WARNING,
    },

    [AppErrorCode.ALREADY_EXISTS]: {
        message: "Resource already exists",
        severity: ErrorSeverity.WARNING,
    },

    [AppErrorCode.INVALID_INPUT]: {
        message: "Invalid input",
        severity: ErrorSeverity.WARNING,
    },

    [AppErrorCode.INVALID_STATE]: {
        message: "Invalid state",
        severity: ErrorSeverity.ERROR,
    },

    [AppErrorCode.TRANSFORMATION_FAILED]: {
        message: "Object transformation failed",
        severity: ErrorSeverity.ERROR,
    },
} as const;

export interface AppExceptionOptions {
        // Error identity
    code: AppErrorCode;

    // Operational behavior
    severity?: ErrorSeverity;
    disconnect?: boolean;
    // Data the client is allowed to see
    clientData?: Record<string, unknown>;

    // Server-only human-readable explanation
    details?: string;

    // Server-only diagnostic information
    context?: Record<string, unknown>;
}

export class AppException extends Error {
    public readonly code: AppErrorCode;
    public readonly severity: ErrorSeverity;
    public readonly clientData: Record<string, unknown> | undefined;
    public readonly context: Record<string, unknown> | undefined;
    public readonly details: string | undefined;
    public readonly disconnect: boolean;

    constructor(
        message: string,
        options: AppExceptionOptions,
    ) {
        super(message);

        this.name = 'AppException';

        this.code = options.code;

        this.severity = options.severity ?? ErrorSeverity.ERROR;

        this.clientData = options.clientData;

        this.context = options.context;

        this.details = options.details;

        this.disconnect = options.disconnect ?? false;

        Error.captureStackTrace(this, AppException);
    }
}

export function appError(
    code: AppErrorCode,
    options?: {
        severity?: ErrorSeverity;
        clientData?: Record<string, unknown>;
        context?: Record<string, unknown>;
        details?: string;
        disconnect?: boolean;
    },
): AppException {
    const definition = AppErrorDefinitions[code];

    return new AppException(definition.message, {
        code,
        severity: options?.severity ?? definition.severity,
        ...(options?.clientData !== undefined && {
                    clientData: options.clientData,
        }),

        ...(options?.context !== undefined && {
            context: options.context,
        }),

        ...(options?.details !== undefined && {
            details: options.details,
        }),

        ...(options?.disconnect !== undefined && {
            disconnect: options.disconnect,
        }),

    });
}