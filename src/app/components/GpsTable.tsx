"use client";
import { useEffect, useState } from "react";

export default function GpsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // 🟢 STEP 1: Fetch existing data (Partners + Confirmed Bookings)
    async function fetchInitialData() {
      try {
        // Fetch last known partner GPS data
        const [partnersRes, confirmedRes] = await Promise.all([
          fetch("/api/partners"),
          fetch("/api/bookings/confirmed"),
        ]);

        if (!partnersRes.ok) {
          console.error("Failed to fetch partners:", await partnersRes.text());
        }
        
        if (!confirmedRes.ok) {
          console.error("Failed to fetch confirmed bookings:", await confirmedRes.text());
        }

        const partners = await partnersRes.json();
        const confirmed = await confirmedRes.json();

        // Load GPS data
        setRows(
          partners.map((p: any) => ({
            partnerId: p._id,
            lat: p.location?.lat ?? 0,
            lng: p.location?.lng ?? 0,
            ts: p.updatedAt,
          }))
        );

        // Load confirmed bookings
        setLogs(
          confirmed.map((b: any) => ({
            bookingId: b._id,
            partnerId: b.partnerId,
            ts: b.updatedAt,
          }))
        );
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }

    fetchInitialData();

    // 🟢 STEP 2: Open live event stream for updates
    const ev = new EventSource("/api/events/stream");

    // Live GPS updates
    const onGps = (e: MessageEvent) =>
      setRows((prev) => [JSON.parse(e.data), ...prev].slice(0, 20));
    ev.addEventListener("partner:gps", onGps as any);

    // Live booking confirmation updates
    const onConfirm = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setLogs((prev) => [data, ...prev].slice(0, 10));
    };
    ev.addEventListener("booking:confirmed", onConfirm as any);

    // Cleanup
    return () => {
      ev.removeEventListener("partner:gps", onGps as any);
      ev.removeEventListener("booking:confirmed", onConfirm as any);
      ev.close();
    };
  }, []);

  return (
    <div>
      {/* GPS Section */}
      <h2>Live Partner GPS (last 20)</h2>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.partnerId}</td>
              <td>{r.lat?.toFixed?.(5) ?? "—"}</td>
              <td>{r.lng?.toFixed?.(5) ?? "—"}</td>
              <td>{new Date(r.ts).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmations Section */}
      <h2 style={{ marginTop: 24 }}>Recent Booking Confirmations</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            ✅ Booking {log.bookingId} confirmed for partner {log.partnerId} at{" "}
            {new Date(log.ts).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
