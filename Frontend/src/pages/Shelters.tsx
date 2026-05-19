import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, MapPin, Users, Phone, Clock, CheckCircle, XCircle, Search, Filter, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

interface Shelter {
  id: string;
  name: string;
  nameUr: string;
  address: string;
  city: string;
  type: "government" | "ngo" | "community";
  capacity: number;
  currentOccupancy: number;
  status: "open" | "full" | "closed";
  phone: string;
  distance: string;
  facilities: string[];
  lat: number;
  lng: number;
}

const mockShelters: Shelter[] = [
  { id: "1", name: "NDMA Relief Camp", nameUr: "این ڈی ایم اے ریلیف کیمپ", address: "GT Road, near Toll Plaza", city: "Islamabad", type: "government", capacity: 500, currentOccupancy: 234, status: "open", phone: "051-9205037", distance: "2.3 km", facilities: ["Medical Aid", "Food", "Water", "Blankets"], lat: 33.6844, lng: 73.0479 },
  { id: "2", name: "Al-Khidmat Foundation Shelter", nameUr: "الخدمت فاؤنڈیشن شیلٹر", address: "Main Boulevard, Gulberg", city: "Lahore", type: "ngo", capacity: 300, currentOccupancy: 298, status: "full", phone: "042-35761999", distance: "5.1 km", facilities: ["Medical Aid", "Food", "Children Care"], lat: 31.5204, lng: 74.3587 },
  { id: "3", name: "Community Masjid Relief Center", nameUr: "کمیونٹی مسجد ریلیف سینٹر", address: "Saddar Bazaar", city: "Rawalpindi", type: "community", capacity: 150, currentOccupancy: 89, status: "open", phone: "051-5566778", distance: "1.8 km", facilities: ["Food", "Water", "Prayer Area"], lat: 33.5651, lng: 73.0169 },
  { id: "4", name: "PDMA Emergency Camp", nameUr: "پی ڈی ایم اے ایمرجنسی کیمپ", address: "University Road", city: "Peshawar", type: "government", capacity: 400, currentOccupancy: 312, status: "open", phone: "091-9211427", distance: "8.4 km", facilities: ["Medical Aid", "Food", "Water", "Tents"], lat: 34.0151, lng: 71.5249 },
  { id: "5", name: "Edhi Foundation Center", nameUr: "ایدھی فاؤنڈیشن سینٹر", address: "Korangi Road", city: "Karachi", type: "ngo", capacity: 600, currentOccupancy: 420, status: "open", phone: "021-32413232", distance: "12 km", facilities: ["Medical Aid", "Food", "Water", "Ambulance"], lat: 24.8607, lng: 67.0011 },
  { id: "6", name: "Flood Relief Center", nameUr: "سیلاب ریلیف سینٹر", address: "Sargodha Road", city: "Faisalabad", type: "government", capacity: 250, currentOccupancy: 250, status: "full", phone: "041-9200123", distance: "3.2 km", facilities: ["Food", "Water", "Blankets"], lat: 31.4504, lng: 73.135 },
];

const Shelters: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "full">("all");

  const filtered = mockShelters.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><Shield className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-display text-lg font-bold text-foreground">ResQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">🏕️ Shelter Finder</h1>
          <p className="mb-8 text-muted-foreground">Find nearby shelters and relief centers across Pakistan</p>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-10" />
            </div>
            <div className="flex gap-2">
              {(["all", "open", "full"] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
                  {s === "all" ? "All" : s === "open" ? "🟢 Open" : "🔴 Full"}
                </button>
              ))}
            </div>
          </div>

          {/* Shelter Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((shelter, i) => (
              <motion.div
                key={shelter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{shelter.name}</h3>
                    <p className="text-xs text-muted-foreground">{shelter.address}, {shelter.city}</p>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    shelter.status === "open" ? "bg-safety/10 text-safety" : shelter.status === "full" ? "bg-alert/10 text-alert" : "bg-secondary text-muted-foreground"
                  }`}>
                    {shelter.status === "open" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {shelter.status.toUpperCase()}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Capacity</span>
                    <span>{shelter.currentOccupancy}/{shelter.capacity}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${shelter.currentOccupancy / shelter.capacity > 0.9 ? "bg-alert" : "bg-safety"}`}
                      style={{ width: `${(shelter.currentOccupancy / shelter.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {shelter.facilities.map((f) => (
                    <span key={f} className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">{f}</span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {shelter.distance}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {shelter.phone}</span>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className={`rounded px-1.5 py-0.5 ${
                    shelter.type === "government" ? "bg-info/10 text-info" : shelter.type === "ngo" ? "bg-trust/10 text-trust" : "bg-safety/10 text-safety"
                  }`}>
                    {shelter.type.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Shelters;
