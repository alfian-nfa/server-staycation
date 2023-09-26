// seed-data.js
const mongoose = require("mongoose");
const seeder = require("mongoose-seed");

// Connect to your MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/db_staycation_dev");

// Load Mongoose models
seeder.loadModels([
  "models/Category.js",
  // Add other models as needed
]);

// Define your data
const data = [
  {
    model: "Category",
    documents: [
      {
        _id: new mongoose.Types.ObjectId("5e96cbe292b97300fc901111"),
        name: "Houses with beauty backyard",
        itemId: [
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902222"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902223"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902224"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902225"),
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("5e96cbe292b97300fc901112"),
        name: "Hotels with large living room",
        itemId: [
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902226"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902227"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902228"),
          new mongoose.Types.ObjectId("5e96cbe292b97300fc902229"),
        ],
      },
      // Add more category data as needed
    ],
  },
  // Add more models and data as needed
];

// Seed your data
seeder.populateModels(data, () => {
  seeder.disconnect();
});
