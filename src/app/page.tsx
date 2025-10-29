import Bookings from "@/app/components/Bookings";
import GpsTable from "@/app/components/GpsTable";
export default function Page() {
  return (
    <main style={{padding:16, maxWidth:900, margin:"0 auto"}}>
      <h1>Rentkar Admin Dashboard</h1>
      <p>Buttons call endpoints protected by Redis locks; GPS is real-time via SSE.</p>
      <Bookings />
      <div style={{marginTop:24}}><GpsTable /></div>
    </main>
  );
}
