import { STATUS_CODES } from "http";

export default class HttpError extends Error {
  statusCode: number;

  constructor(code: number, message: string) {
    super(message || STATUS_CODES[code]);
    this.statusCode = code;
  }
}
