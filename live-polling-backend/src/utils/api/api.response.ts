export class ApiError extends Error {
  public override message: string;
  public statusCode: number;
  public success: boolean;
  public data: unknown;

  constructor(
    message: string,
    statusCode: number,
    success: boolean = false,
    data: unknown = {}
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
  }
}

export class ApiResp {
  public statusCode: number;
  public message: string;
  public success: boolean;
  public data?: unknown;

  constructor(
    message: string,
    statusCode: number,
    success: boolean = true,
    data: unknown = {}
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
  }
}
