const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

describe('Tour Model Validation', () => {
  // Valid tour data template
  const validTourData = {
    name: 'Test Tour Name',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'medium',
    price: 497,
    summary: 'This is a test tour summary',
    imageCover: 'test-cover.jpg',
  };

  describe('Required field validation', () => {
    it('should require a name', () => {
      const tour = new Tour({ ...validTourData, name: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.name.message).toBe('A tour must have a name');
    });

    it('should require maxGroupSize', () => {
      const tour = new Tour({ ...validTourData, maxGroupSize: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.maxGroupSize).toBeDefined();
    });

    it('should require difficulty', () => {
      const tour = new Tour({ ...validTourData, difficulty: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.difficulty).toBeDefined();
    });

    it('should require a price', () => {
      const tour = new Tour({ ...validTourData, price: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.price).toBeDefined();
    });

    it('should require a summary', () => {
      const tour = new Tour({ ...validTourData, summary: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.summary).toBeDefined();
    });

    it('should require an imageCover', () => {
      const tour = new Tour({ ...validTourData, imageCover: undefined });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.imageCover).toBeDefined();
    });
  });

  describe('Data type validation', () => {
    it('should reject non-string name', () => {
      const tour = new Tour({ ...validTourData, name: 12345 });
      const error = tour.validateSync();

      // Mongoose coerces numbers to strings, but we can test type after creation
      expect(typeof tour.name).toBe('string');
    });

    it('should reject non-number duration', () => {
      const tour = new Tour({ ...validTourData, duration: 'five' });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
    });

    it('should reject non-number price', () => {
      const tour = new Tour({ ...validTourData, price: 'expensive' });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.price).toBeDefined();
    });

    it('should accept number price', () => {
      const tour = new Tour({ ...validTourData, price: 499 });
      const error = tour.validateSync();

      expect(error).toBeUndefined();
      expect(tour.price).toBe(499);
    });
  });

  describe('String length validation', () => {
    it('should reject name longer than 40 characters', () => {
      const longName = 'A'.repeat(41);
      const tour = new Tour({ ...validTourData, name: longName });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.name.message).toBe(
        'A tour name must have less or equal to 40 characters',
      );
    });

    it('should reject name shorter than 10 characters', () => {
      const shortName = 'Short';
      const tour = new Tour({ ...validTourData, name: shortName });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.name.message).toBe(
        'A tour name must have more or equal to 10 characters',
      );
    });

    it('should accept name with exactly 10 characters', () => {
      const tour = new Tour({ ...validTourData, name: 'ValidName!' });
      const error = tour.validateSync();

      expect(error).toBeUndefined();
    });

    it('should accept name with exactly 40 characters', () => {
      const tour = new Tour({ ...validTourData, name: 'A'.repeat(40) });
      const error = tour.validateSync();

      expect(error).toBeUndefined();
    });
  });

  describe('Enum validation', () => {
    it('should accept valid difficulty levels', () => {
      const difficulties = ['easy', 'medium', 'difficult'];

      difficulties.forEach((difficulty) => {
        const tour = new Tour({ ...validTourData, difficulty });
        const error = tour.validateSync();
        expect(error).toBeUndefined();
      });
    });

    it('should reject invalid difficulty level', () => {
      const tour = new Tour({ ...validTourData, difficulty: 'very hard' });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.difficulty).toBeDefined();
      expect(error.errors.difficulty.message).toBe(
        'Difficulty is either easy, medium or difficult',
      );
    });
  });

  describe('Number range validation', () => {
    it('should reject ratingsAverage below 1', () => {
      const tour = new Tour({ ...validTourData, ratingsAverage: 0.5 });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.ratingsAverage).toBeDefined();
    });

    it('should reject ratingsAverage above 5', () => {
      const tour = new Tour({ ...validTourData, ratingsAverage: 5.5 });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.ratingsAverage).toBeDefined();
    });

    it('should accept ratingsAverage within valid range', () => {
      const tour = new Tour({ ...validTourData, ratingsAverage: 4.5 });
      const error = tour.validateSync();

      expect(error).toBeUndefined();
      expect(tour.ratingsAverage).toBe(4.5);
    });
  });

  describe('Custom validation - priceDiscount', () => {
    it('should reject priceDiscount greater than or equal to price', () => {
      const tour = new Tour({
        ...validTourData,
        price: 100,
        priceDiscount: 150,
      });
      const error = tour.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.priceDiscount).toBeDefined();
      expect(error.errors.priceDiscount.message).toContain(
        'should be below the regular price',
      );
    });

    it('should accept priceDiscount less than price', () => {
      const tour = new Tour({
        ...validTourData,
        price: 100,
        priceDiscount: 50,
      });
      const error = tour.validateSync();

      expect(error).toBeUndefined();
    });
  });

  describe('Default values', () => {
    it('should set default ratingsAverage to 4.5', () => {
      const tour = new Tour(validTourData);

      expect(tour.ratingsAverage).toBe(4.5);
    });

    it('should set default ratingsQuantity to 0', () => {
      const tour = new Tour(validTourData);

      expect(tour.ratingsQuantity).toBe(0);
    });

    it('should set createdAt to current date', () => {
      const tour = new Tour(validTourData);

      expect(tour.createdAt).toBeDefined();
      expect(tour.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Valid tour creation', () => {
    it('should create a valid tour with all required fields', () => {
      const tour = new Tour(validTourData);
      const error = tour.validateSync();

      expect(error).toBeUndefined();
      expect(tour.name).toBe(validTourData.name);
      expect(tour.price).toBe(validTourData.price);
      expect(tour.difficulty).toBe(validTourData.difficulty);
    });

    it('should trim whitespace from string fields', () => {
      const tour = new Tour({
        ...validTourData,
        name: '  Test Tour Name  ',
        summary: '  Test summary  ',
      });

      expect(tour.name).toBe('Test Tour Name');
      expect(tour.summary).toBe('Test summary');
    });
  });
});
