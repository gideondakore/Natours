const AppError = require("../utils/appError");

describe("AppError Utility", () => {
  describe("AppError class", () => {
    it("should create an error with correct message and status code", () => {
      const error = new AppError("Test error", 404);
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(404);
    });

    it('should set status to "fail" for 4xx status codes', () => {
      const error404 = new AppError("Not found", 404);
      const error400 = new AppError("Bad request", 400);

      expect(error404.status).toBe("fail");
      expect(error400.status).toBe("fail");
    });

    it('should set status to "error" for 5xx status codes', () => {
      const error500 = new AppError("Server error", 500);
      const error503 = new AppError("Service unavailable", 503);

      expect(error500.status).toBe("error");
      expect(error503.status).toBe("error");
    });

    it("should set isOperational to true", () => {
      const error = new AppError("Test error", 400);
      expect(error.isOperational).toBe(true);
    });

    it("should be an instance of Error", () => {
      const error = new AppError("Test error", 400);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    it("should capture stack trace", () => {
      const error = new AppError("Test error", 400);
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
    });
  });
});
