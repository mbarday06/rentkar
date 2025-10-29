import "dotenv/config";
import { connectMongo } from "@/app/server/db";
import Booking from "@/app/server/models/Booking";
import Partner from "@/app/server/models/Partner";

async function main() {

  console.log("🔗 Connecting to MongoDB at:", process.env.MONGODB_URI);
  await connectMongo();

  // Clean collections
  await Partner.deleteMany({});
  await Booking.deleteMany({});

  // ✅ Seed partner with string _id as per assignment spec
  await Partner.create({
    _id: "partner123",
    name: "Test Partner",
    city: "mumbai",
    status: "online",
    location: { lat: 19.20, lng: 72.82 },
  });

  // ✅ Seed booking
  await Booking.create({
    _id: "687761e7c5bc4044c6d75cb3",
    userId: "68108f18d1224f8f22316a7b",
    packageId: "685612cd3225791ecbb86b6e",
    startDate: "2025-07-19T00:00:00.000Z",
    endDate: "2025-07-20T00:00:00.000Z",
    isSelfPickup: false,
    location: "mumbai",
    deliveryTime: { startHour: 12, endHour: 14 },
    selectedPlan: { duration: 1, price: 590 },
    priceBreakDown: {
      basePrice: 590,
      deliveryCharge: 250,
      grandTotal: 1580.02,
    },
    document: [
      {
        docType: "SELFIE",
        docLink: "https://example/selfie.jpg",
        status: "APPROVED",
      },
      {
        docType: "SIGNATURE",
        docLink: "https://example/sign.jpg",
        status: "APPROVED",
      },
    ],
    address: {
      buildingAreaName: "Pooja Enclave",
      houseNumber: "A/603",
      streetAddress: "Kandivali West, Mumbai",
      zip: "400067",
      latitude: 19.203258,
      longitude: 72.8278919,
    },
  });

  console.log("✅ Database seeded successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error during seed:", err);
  process.exit(1);
});
