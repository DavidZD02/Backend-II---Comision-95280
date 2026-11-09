class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  static assert(condition, message, status) {
    if (!condition) {
      throw new AppError(message, status);
    }
  }
}

export default AppError;