

export class ParserError extends Error {
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}

export class UnsupportedVersionError extends ParserError {
    constructor(message?: string) {
        super('UnsupportedVersionError', message ?? 'This save version is not supported.');
    }
}

export class CorruptSaveError extends ParserError {
    constructor(message?: string) {
        super('CorruptSaveError', message ?? 'This save data is most likely corrupt.');
    }
}

export class CompressionLibraryError extends ParserError {
    constructor(message?: string) {
        super('CompressionLibraryError', message ?? 'Failed to compress/decompress save data.');
    }
}

export class TimeoutError extends ParserError {
    constructor(message?: string) {
        super('TimeoutError', message ?? 'Operation timed out.');
    }
}

export class UnimplementedError extends ParserError {
    constructor(message?: string) {
        super('UnimplementedError', message ?? 'Unimplemented Operation.');
    }
}
