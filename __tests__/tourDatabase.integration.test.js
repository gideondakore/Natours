const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Tour = require("../models/tourModel");

let mongoServer;

// Setup: Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  // Create a simple User schema to satisfy Tour model's populate requirement
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
  });

  // Only register User model if it hasn't been registered yet
  if (!mongoose.models.User) {
    mongoose.model("User", userSchema);
  }
});

// Cleanup: Close connection and stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await Tour.deleteMany({});
});

describe("Tour Database Integration Tests", () => {
  // Valid tour data template
  const validTourData = {
    name: "The Forest Hiker",
    duration: 5,
    maxGroupSize: 25,
    difficulty: "easy",
    price: 397,
    summary: "Breathtaking hike through the Canadian Banff National Park",
    imageCover: "tour-1-cover.jpg",
    // Minimal required fields for schema
    startLocation: {
      type: "Point",
      coordinates: [0, 0], // Any coordinates work
    },
    locations: [], // Empty array is fine
    guides: [], // Empty array is fine
  };

  describe("Creating Tours in Database", () => {
    it("should successfully create and save a valid tour", async () => {
      const tour = new Tour(validTourData);
      const savedTour = await tour.save();

      expect(savedTour._id).toBeDefined();
      expect(savedTour.name).toBe(validTourData.name);
      expect(savedTour.duration).toBe(validTourData.duration);
      expect(savedTour.price).toBe(validTourData.price);
      expect(savedTour.difficulty).toBe(validTourData.difficulty);
      expect(savedTour.slug).toBe("the-forest-hiker");
    });

    it("should set default values for ratingsAverage and ratingsQuantity", async () => {
      const tour = new Tour(validTourData);
      const savedTour = await tour.save();

      expect(savedTour.ratingsAverage).toBe(4.5);
      expect(savedTour.ratingsQuantity).toBe(0);
    });

    it("should generate a slug from the tour name", async () => {
      const tourWithSpaces = {
        ...validTourData,
        name: "The Amazing Adventure Tour",
      };
      const tour = new Tour(tourWithSpaces);
      const savedTour = await tour.save();

      expect(savedTour.slug).toBe("the-amazing-adventure-tour");
    });

    it("should reject tour with missing required name field", async () => {
      const tourWithoutName = { ...validTourData };
      delete tourWithoutName.name;

      const tour = new Tour(tourWithoutName);

      await expect(tour.save()).rejects.toThrow("A tour must have a name");
    });

    it("should reject tour with missing required price field", async () => {
      const tourWithoutPrice = { ...validTourData };
      delete tourWithoutPrice.price;

      const tour = new Tour(tourWithoutPrice);

      await expect(tour.save()).rejects.toThrow("A tour must have a price");
    });

    it("should reject tour with duplicate name", async () => {
      const tour1 = new Tour(validTourData);
      await tour1.save();

      const tour2 = new Tour(validTourData);

      await expect(tour2.save()).rejects.toThrow();
    });

    it("should reject tour with invalid difficulty value", async () => {
      const tourWithInvalidDifficulty = {
        ...validTourData,
        difficulty: "extreme",
      };

      const tour = new Tour(tourWithInvalidDifficulty);

      await expect(tour.save()).rejects.toThrow(
        "Difficulty is either easy, medium or difficult",
      );
    });
  });

  describe("Querying Tours from Database", () => {
    beforeEach(async () => {
      // Seed database with test tours
      await Tour.create([
        {
          ...validTourData,
          name: "The Forest Hiker Tour",
          price: 397,
          difficulty: "easy",
        },
        {
          ...validTourData,
          name: "The Sea Explorer Tour",
          price: 497,
          difficulty: "medium",
        },
        {
          ...validTourData,
          name: "The Mountain Climber",
          price: 997,
          difficulty: "difficult",
        },
      ]);
    });

    it("should retrieve all tours from database", async () => {
      const tours = await Tour.find();

      expect(tours).toHaveLength(3);
      expect(tours[0].name).toBeDefined();
      expect(tours[1].name).toBeDefined();
      expect(tours[2].name).toBeDefined();
    });

    it("should find tour by ID", async () => {
      const createdTour = await Tour.create(validTourData);
      const foundTour = await Tour.findById(createdTour._id);

      expect(foundTour).toBeDefined();
      expect(foundTour._id.toString()).toBe(createdTour._id.toString());
      expect(foundTour.name).toBe(validTourData.name);
    });

    it("should filter tours by difficulty", async () => {
      const easyTours = await Tour.find({ difficulty: "easy" });

      expect(easyTours).toHaveLength(1);
      expect(easyTours[0].difficulty).toBe("easy");
    });

    it("should filter tours by price range", async () => {
      const affordableTours = await Tour.find({ price: { $lt: 500 } });

      expect(affordableTours).toHaveLength(2);
      expect(affordableTours.every((tour) => tour.price < 500)).toBe(true);
    });

    it("should sort tours by price ascending", async () => {
      const sortedTours = await Tour.find().sort({ price: 1 });

      expect(sortedTours[0].price).toBe(397);
      expect(sortedTours[1].price).toBe(497);
      expect(sortedTours[2].price).toBe(997);
    });

    it("should limit number of results", async () => {
      const limitedTours = await Tour.find().limit(2);

      expect(limitedTours).toHaveLength(2);
    });

    it("should select specific fields", async () => {
      const tours = await Tour.find().select("name price");

      expect(tours[0].name).toBeDefined();
      expect(tours[0].price).toBeDefined();
      expect(tours[0].summary).toBeUndefined();
    });
  });

  describe("Updating Tours in Database", () => {
    it("should update tour price", async () => {
      const tour = await Tour.create(validTourData);
      const newPrice = 450;

      const updatedTour = await Tour.findByIdAndUpdate(
        tour._id,
        { price: newPrice },
        { new: true, runValidators: true },
      );

      expect(updatedTour.price).toBe(newPrice);
      expect(updatedTour.name).toBe(validTourData.name);
    });

    it("should update tour difficulty", async () => {
      const tour = await Tour.create(validTourData);

      const updatedTour = await Tour.findByIdAndUpdate(
        tour._id,
        { difficulty: "difficult" },
        { new: true, runValidators: true },
      );

      expect(updatedTour.difficulty).toBe("difficult");
    });

    it("should update multiple fields at once", async () => {
      const tour = await Tour.create(validTourData);

      const updatedTour = await Tour.findByIdAndUpdate(
        tour._id,
        {
          price: 500,
          difficulty: "medium",
          maxGroupSize: 15,
        },
        { new: true, runValidators: true },
      );

      expect(updatedTour.price).toBe(500);
      expect(updatedTour.difficulty).toBe("medium");
      expect(updatedTour.maxGroupSize).toBe(15);
    });

    it("should reject update with invalid difficulty", async () => {
      const tour = await Tour.create(validTourData);

      await expect(
        Tour.findByIdAndUpdate(
          tour._id,
          { difficulty: "extreme" },
          { new: true, runValidators: true },
        ),
      ).rejects.toThrow();
    });

    it("should return null when updating non-existent tour", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const result = await Tour.findByIdAndUpdate(
        fakeId,
        { price: 999 },
        { new: true },
      );

      expect(result).toBeNull();
    });
  });

  describe("Deleting Tours from Database", () => {
    it("should delete a tour by ID", async () => {
      const tour = await Tour.create(validTourData);
      const tourId = tour._id;

      await Tour.findByIdAndDelete(tourId);

      const deletedTour = await Tour.findById(tourId);
      expect(deletedTour).toBeNull();
    });

    it("should delete multiple tours matching criteria", async () => {
      await Tour.create([
        { ...validTourData, name: "Easy Tour 1", difficulty: "easy" },
        { ...validTourData, name: "Easy Tour 2", difficulty: "easy" },
        { ...validTourData, name: "Hard Tour 1", difficulty: "difficult" },
      ]);

      const deleteResult = await Tour.deleteMany({ difficulty: "easy" });

      expect(deleteResult.deletedCount).toBe(2);

      const remainingTours = await Tour.find();
      expect(remainingTours).toHaveLength(1);
      expect(remainingTours[0].difficulty).toBe("difficult");
    });

    it("should return null when deleting non-existent tour", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const result = await Tour.findByIdAndDelete(fakeId);

      expect(result).toBeNull();
    });
  });

  describe("Database Aggregation and Advanced Queries", () => {
    beforeEach(async () => {
      await Tour.create([
        {
          ...validTourData,
          name: "Tour 1 - Easy Budget",
          price: 300,
          difficulty: "easy",
          ratingsAverage: 4.5,
        },
        {
          ...validTourData,
          name: "Tour 2 - Easy Premium",
          price: 500,
          difficulty: "easy",
          ratingsAverage: 4.8,
        },
        {
          ...validTourData,
          name: "Tour 3 - Medium Adventure",
          price: 700,
          difficulty: "medium",
          ratingsAverage: 4.6,
        },
      ]);
    });

    it("should count tours by difficulty", async () => {
      const easyCount = await Tour.countDocuments({ difficulty: "easy" });
      const mediumCount = await Tour.countDocuments({ difficulty: "medium" });

      expect(easyCount).toBe(2);
      expect(mediumCount).toBe(1);
    });

    it("should find tours with price greater than or equal to value", async () => {
      const expensiveTours = await Tour.find({ price: { $gte: 500 } });

      expect(expensiveTours).toHaveLength(2);
      expect(expensiveTours.every((tour) => tour.price >= 500)).toBe(true);
    });

    it("should find tours matching multiple criteria", async () => {
      const tours = await Tour.find({
        difficulty: "easy",
        price: { $lt: 400 },
      });

      expect(tours).toHaveLength(1);
      expect(tours[0].name).toBe("Tour 1 - Easy Budget");
    });
  });

  describe("Database Transaction Rollback", () => {
    it("should rollback changes if validation fails", async () => {
      const initialCount = await Tour.countDocuments();
      expect(initialCount).toBe(0);

      try {
        await Tour.create({
          ...validTourData,
          difficulty: "invalid",
        });
      } catch (error) {
        // Expected to fail
      }

      const finalCount = await Tour.countDocuments();
      expect(finalCount).toBe(0);
    });
  });
});
