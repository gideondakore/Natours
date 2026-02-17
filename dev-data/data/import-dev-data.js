const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/userModel");

dotenv.config({
  path: "./.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => console.log(`DB connection successful`));

//READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    // console.log('Data: ', tours);
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log("Data successfully loaded!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

//DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data successfully deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

const removeId = () => {
  const tourTemp = tours;
  const data = tourTemp.map((tour) => {
    // console.log(tour, '\n=================================');
    if ("id" in tour) delete tour.id;
    return tour;
  });
  return data;
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--delete-id") {
  const data = removeId();
  //   console.log('New Tour Data without id: ', data);
  fs.writeFileSync(
    `${__dirname}/tours-simple1.json`,
    JSON.stringify(data),
    "utf-8",
  );
  process.exit();
}
// console.log(process.argv);
