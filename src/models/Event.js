import mongoose, { Schema } from "mongoose";

// Un "event" representa un torneo deportivo.
const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
