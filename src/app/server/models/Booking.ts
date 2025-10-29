import mongoose from "mongoose";

const { Schema, model, models } = mongoose;


const DocSchema = new Schema({ 
    docType: String, 
    docLink: String,
    status: { type: String, enum: ["PENDING","APPROVED","REJECTED"], default: "PENDING" } 
});

const BookingSchema = new Schema({
  userId: String, packageId: String,
  startDate: Date, endDate: Date,
  isSelfPickup: Boolean, location: String,
  deliveryTime: { startHour: Number, endHour: Number },
  selectedPlan: { duration: Number, price: Number },
  priceBreakDown: { basePrice: Number, deliveryCharge: Number, grandTotal: Number },
  document: [DocSchema],
  address: { buildingAreaName: String, houseNumber: String, streetAddress: String, zip: String, latitude: Number, longitude: Number },
  partnerId: { type: String, ref: "Partner", default: null },
  status: { type: String, enum: ["created","review","confirmed"], default: "created" }
}, { timestamps: true });

export default models.Booking || model("Booking", BookingSchema);
