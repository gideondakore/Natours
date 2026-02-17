const catchAsync = require('../utils/catchAsync');

describe('CatchAsync Utility', () => {
  describe('catchAsync wrapper function', () => {
    it('should be a function that returns a function', () => {
      const asyncFn = async () => {};
      const wrapped = catchAsync(asyncFn);
      expect(typeof catchAsync).toBe('function');
      expect(typeof wrapped).toBe('function');
    });

    it('should call the wrapped function with req, res, next', async () => {
      const mockFn = jest.fn(async (req, res, next) => {
        res.status(200).json({ success: true });
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const wrapped = catchAsync(mockFn);
      await wrapped(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch errors and pass them to next middleware', async () => {
      const error = new Error('Test error');
      const asyncFn = jest.fn(async () => {
        throw error;
      });

      const req = {};
      const res = {};
      const next = jest.fn();

      const wrapped = catchAsync(asyncFn);
      await wrapped(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle rejected promises', async () => {
      const error = new Error('Promise rejection');
      const asyncFn = jest.fn(() => Promise.reject(error));

      const req = {};
      const res = {};
      const next = jest.fn();

      const wrapped = catchAsync(asyncFn);
      await wrapped(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should not call next if function succeeds', async () => {
      const asyncFn = jest.fn(async (req, res) => {
        res.status(200).json({ success: true });
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const wrapped = catchAsync(asyncFn);
      await wrapped(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
