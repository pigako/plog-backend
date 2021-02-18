import { HttpException, HttpStatus } from "@nestjs/common";

type ErrorExplain = {
    code: string;
    message: string;
};
type ErrorObject = {
    statusCode: HttpStatus;
    error: ErrorExplain;
};

enum CustomErrorType {
    ERROR_ALREADY_EXISTS_USER,
    ERROR_DONT_FIND_USER
}

type ErrorKey = keyof typeof HttpStatus | keyof typeof CustomErrorType;

type ErrorType = Partial<Record<ErrorKey, ErrorObject>>;

export const ERROR: ErrorType = {
    "ERROR_ALREADY_EXISTS_USER": {
        statusCode: HttpStatus.BAD_REQUEST,
        error: {
            code: "ERROR_ALREADY_EXISTS_USER",
            message: "이미 존재하는 아이디입니다."
        }
    },
    "ERROR_DONT_FIND_USER": {
        statusCode: HttpStatus.BAD_REQUEST,
        error: {
            code: "ERROR_DONT_FIND_USER",
            message: "존재하지 않는 아이디입니다."
        }
    },
    "INTERNAL_SERVER_ERROR": {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: ""
        }
    }
};

export function throwError(type: ErrorKey, explain?: ErrorExplain) {
    const target = ERROR[type];

    if (explain) {
        target.error = explain;
    }

    throw new HttpException(target, target.statusCode);
}
