export class TryCatchError {
    constructor(
        public readonly title: string,
        public readonly message: string,
    ) {}
}

export type Unwrap<T> =
    T extends Success<infer U>
        ? U
        : T extends Failure
          ? never
          : T extends Result<infer U>
            ? U
            : T extends Success<infer U> | Failure
              ? U
              : never;

export class Success<T> {
    readonly success = true as const;

    constructor(
        public readonly data: T,
        public readonly warnings?: { warning: string; details?: string }[],
    ) {}

    unwrap(): T {
        return this.data;
    }

    unwrapOr<U>(_defaultValue: U): T {
        return this.data;
    }
}

export class Failure {
    readonly success = false as const;

    constructor(public readonly error: TryCatchError) {}

    unwrap(): never {
        throw new Error(this.error.message);
    }

    unwrapOr<U>(defaultValue: U): U {
        return defaultValue;
    }
}

export type Result<T> = Success<T> | Failure;

function isPromise<T = unknown>(value: unknown): value is Promise<T> {
    return (
        !!value &&
        (typeof value === "object" || typeof value === "function") &&
        typeof (value as { then?: unknown }).then === "function"
    );
}

export function tryCatch<T>(operation: Promise<T>): Promise<Result<T>>;
export function tryCatch<T>(operation: () => Promise<T>): Promise<Result<T>>;
export function tryCatch<T>(operation: () => T): Result<T>;
export function tryCatch<T>(
    operation: Promise<T> | (() => T) | (() => Promise<T>),
): Result<T> | Promise<Result<T>> {
    if (typeof operation === "function") {
        try {
            const result = operation();

            if (isPromise(result)) {
                return result
                    .then((data: T) => new Success(data))
                    .catch((error: unknown) => new Failure(newError(error)));
            }

            return new Success(result);
        } catch (error) {
            return new Failure(newError(error));
        }
    }

    return operation
        .then((data: T) => new Success(data))
        .catch((error: unknown) => new Failure(newError(error)));
}

export function newError(error: unknown): TryCatchError {
    if (error instanceof TryCatchError) return error;

    if (error instanceof Error) {
        const details: string[] = [error.message];

        if ("body" in error && error.body) {
            details.push(JSON.stringify(error.body));
        }
        if ("status" in error) {
            details.push(`Status: ${error.status}`);
        }
        if ("cause" in error && error.cause) {
            details.push(`Cause: ${String(error.cause)}`);
        }

        return new TryCatchError(error.name, details.join(" | "));
    }

    if (typeof error === "object" && error !== null) {
        return new TryCatchError("Error", JSON.stringify(error));
    }

    return new TryCatchError("Unknown Error", String(error));
}
