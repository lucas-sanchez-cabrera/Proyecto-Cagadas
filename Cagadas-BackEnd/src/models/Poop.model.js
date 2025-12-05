import mongoose from "mongoose";

const poopSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "Poops",
  }
);

export default mongoose.model("Poops", poopSchema);
