import axios from "axios";

const bookingId = "687761e7c5bc4044c6d75cb3"; // Replace with your seeded booking ID
const url = `http://localhost:3000/api/bookings/${bookingId}/assign`;

async function simulateConcurrentRequests() {
  try {
    console.log("🔹 Sending two concurrent assign requests...");

    const [res1, res2] = await Promise.allSettled([
      axios.post(url),
      axios.post(url),
    ]);

    console.log("\n📦 Result 1:");
    if (res1.status === "fulfilled") console.log(res1.value.data);
    else console.log("❌ Failed:", res1.reason.response?.data || res1.reason.message);

    console.log("\n📦 Result 2:");
    if (res2.status === "fulfilled") console.log(res2.value.data);
    else console.log("❌ Failed:", res2.reason.response?.data || res2.reason.message);

    console.log("\n✅ If only ONE shows 'Assigned successfully' and the other says 'Already assigned', your Redis lock works!");
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
}

simulateConcurrentRequests();
