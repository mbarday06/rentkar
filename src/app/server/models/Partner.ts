import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const PartnerSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ["online", "offline"], default: "offline", index: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

PartnerSchema.index({ location: "2dsphere" });

export default models.Partner || model("Partner", PartnerSchema);
