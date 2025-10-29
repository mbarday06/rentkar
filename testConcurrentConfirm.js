import axios from "axios";

const bookingId = "687761e7c5bc4044c6d75cb3"; // Replace with your booking ID
const url = `http://localhost:3000/api/bookings/${bookingId}/confirm`;

async function simulateConcurrentConfirm() {
  try {
    console.log("🔹 Sending two concurrent confirm requests...");

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

    console.log("\n✅ Expected: One should show 'Booking confirmed successfully', and the other should say 'Booking already confirmed'.");
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
}

simulateConcurrentConfirm();
