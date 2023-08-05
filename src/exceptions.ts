import type { ValidationError as JoiValidationError } from "joi";

export enum ErrorCode {
  Unknown = "unknown",
  NotFound = "not_found",
  InvalidArgument = "invalid_payload",

  UserExist = 'user_exists'
}

export class AppException extends Error {
  public readonly details: unknown;
  public readonly component: string;
  public readonly code: ErrorCode;

  constructor(params: { message: string; details: unknown; component: string; code: ErrorCode }) {
    super(params.message);
    this.code = params.code;
    this.component = params.component;
    this.details = params.details;
  }
}

export class APIException extends AppException {
  public readonly statusCode: number;

  constructor(params: {
    message: string;
    details: unknown;
    component: string;
    code: ErrorCode;
    statusCode: number;
    sensible: boolean;
  }) {
    super(params);
    this.statusCode = params.statusCode;
  }
}


export class ValidationError extends APIException {
  constructor(errors: JoiValidationError) {
    super({
      code: ErrorCode.InvalidArgument,
      statusCode: 400,
      sensible: false,
      message: errors.message,
      details: errors.details,
      component: "Validation"
    });
    this.message = errors.message;
  }
}


export class UserAlreadyExistException extends APIException {
  constructor(email: string) {
    super({
      code: ErrorCode.UserExist,
      details: email,
      component: 'Users',
      message: `User with email ${email}, already exists`,
      sensible: false,
      statusCode: 422,
    });
  }
}
