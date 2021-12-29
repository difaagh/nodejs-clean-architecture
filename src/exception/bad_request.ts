export class BadRequestError extends Error {
  constructor(message: string, codeName: string) {
    super(message);
    this.name = codeName;
  }
}
