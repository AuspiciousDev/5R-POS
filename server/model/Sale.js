const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    transactionID: {
      // type: String,
      // required: true,
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    transactor: {
      type: String,
      required: true,
    },
    items: [
      {
        productID: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalSum: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sale", schema);
