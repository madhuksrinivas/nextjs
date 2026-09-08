import mongoose from "mongoose";

const meetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Meetup = mongoose.models.Meetup || mongoose.model("Meetup", meetupSchema);

export default Meetup;
