"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [rows, setRows] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  // Load bookings
  const reload = async () => {
    try {
      const { data } = await axios.get("/api/bookings");
      setRows(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      alert("Error loading bookings");
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // Assign partner via axios
  const doAssign = async (id: string) => {
    setBusy(id);
    try {
      const response = await axios.post(`/api/bookings/${id}/assign`);
      const { message, partnerId } = response.data;

      if (message === "Already assigned") {
        alert(`ℹ️ ${message} (Partner: ${partnerId})`);
      } else if (message === "Partner assigned successfully") {
        alert(`✅ ${message} (Partner: ${partnerId})`);
      } else {
        alert(`⚠️ ${message}`);
      }

      await reload();
    } catch (e: any) {
      alert(e.response?.data?.message || e.message || "Assign failed");
    } finally {
      setBusy(null);
    }
  };


  // Confirm booking (you can also convert this to axios if you want consistency)
  const doConfirm = async (id: string) => {
    setBusy(id);
    try {
      const response = await axios.post(`/api/bookings/${id}/confirm`);
      const { message, partnerId } = response.data;

      if (message === "Booking already confirmed") {
        alert(`ℹ️ ${message} (Partner: ${partnerId})`);
      } else if (message === "Booking confirmed successfully") {
        alert(`✅ ${message} for partner ${partnerId}`);
      } else {
        alert(`⚠️ ${message}`);
      }

      await reload();
    } catch (e: any) {
      alert(e.response?.data?.message || e.message || "Confirm failed");
    } finally {
      setBusy(null);
    }
  };


  return (
    <div>
      <h2>Bookings</h2>
      <pre style={{ background: "#f6f6f6", padding: 8, fontSize: 12 }}>
        {JSON.stringify(rows, null, 2)}
      </pre>

      {rows.map((b: any) => (
        <div
          key={b._id}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ fontSize: 12, flex: 1 }}>
            <b>{b._id}</b> • status: {b.status} • partner: {b.partnerId || "—"}
          </div>
          <button disabled={busy === b._id} onClick={() => doAssign(b._id)}>
            Assign Partner
          </button>
          <button disabled={busy === b._id} onClick={() => doConfirm(b._id)}>
            Confirm
          </button>
        </div>
      ))}
    </div>
  );
}
