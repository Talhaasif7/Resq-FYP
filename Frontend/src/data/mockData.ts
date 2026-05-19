export interface Crisis {
  id: string;
  title: string;
  titleUr: string;
  location: string;
  locationUr: string;
  category: "floods" | "earthquakes" | "security";
  severity: "critical" | "high" | "moderate";
  trustScore: number;
  timeAgo: string;
  timeAgoUr: string;
  verified: boolean;
}

export interface SafeRoute {
  id: string;
  from: string;
  to: string;
  status: "clear" | "blocked";
  distance: string;
  time: string;
  reason?: string;
}

export const mockCrises: Crisis[] = [
  {
    id: "1",
    title: "Flash Flood Warning — Swat Valley",
    titleUr: "فلیش فلڈ وارننگ — سوات ویلی",
    location: "Swat, KPK",
    locationUr: "سوات، خیبر پختونخوا",
    category: "floods",
    severity: "critical",
    trustScore: 94,
    timeAgo: "2 min ago",
    timeAgoUr: "2 منٹ پہلے",
    verified: true,
  },
  {
    id: "2",
    title: "4.2 Magnitude Earthquake — Quetta",
    titleUr: "4.2 شدت کا زلزلہ — کوئٹہ",
    location: "Quetta, Balochistan",
    locationUr: "کوئٹہ، بلوچستان",
    category: "earthquakes",
    severity: "high",
    trustScore: 87,
    timeAgo: "15 min ago",
    timeAgoUr: "15 منٹ پہلے",
    verified: true,
  },
  {
    id: "3",
    title: "Road Blockage — Karakoram Highway",
    titleUr: "سڑک بند — شاہراہ قراقرم",
    location: "Gilgit-Baltistan",
    locationUr: "گلگت بلتستان",
    category: "security",
    severity: "moderate",
    trustScore: 72,
    timeAgo: "1 hour ago",
    timeAgoUr: "1 گھنٹہ پہلے",
    verified: true,
  },
  {
    id: "4",
    title: "Heavy Rainfall Alert — Lahore",
    titleUr: "شدید بارش کا الرٹ — لاہور",
    location: "Lahore, Punjab",
    locationUr: "لاہور، پنجاب",
    category: "floods",
    severity: "high",
    trustScore: 65,
    timeAgo: "30 min ago",
    timeAgoUr: "30 منٹ پہلے",
    verified: false,
  },
  {
    id: "5",
    title: "Security Incident — Peshawar",
    titleUr: "سیکیورٹی واقعہ — پشاور",
    location: "Peshawar, KPK",
    locationUr: "پشاور، خیبر پختونخوا",
    category: "security",
    severity: "critical",
    trustScore: 91,
    timeAgo: "5 min ago",
    timeAgoUr: "5 منٹ پہلے",
    verified: true,
  },
];

export const mockRoutes: SafeRoute[] = [
  { id: "1", from: "Islamabad", to: "Peshawar", status: "clear", distance: "155 km", time: "2h 30m" },
  { id: "2", from: "Lahore", to: "Multan", status: "blocked", distance: "331 km", time: "N/A", reason: "Flooding on M-2" },
  { id: "3", from: "Karachi", to: "Hyderabad", status: "clear", distance: "164 km", time: "1h 45m" },
  { id: "4", from: "Quetta", to: "Zhob", status: "blocked", distance: "310 km", time: "N/A", reason: "Landslide" },
  { id: "5", from: "Islamabad", to: "Murree", status: "clear", distance: "64 km", time: "1h 15m" },
];

export const mockStats = {
  activeCrises: 12,
  verifiedReports: 847,
  sheltersOpen: 34,
  routesUpdated: 156,
};
