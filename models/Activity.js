const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
  },
  itemId: {
    type: ObjectId,
    ref: "item",
  },
});

module.exports = mongoose.model("Activity", activitySchema);
