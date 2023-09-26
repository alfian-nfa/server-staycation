const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  itemId: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
