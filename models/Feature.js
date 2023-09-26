const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: ObjectId,
    ref: "item",
  },
});

module.exports = mongoose.model("Feature", featureSchema);
