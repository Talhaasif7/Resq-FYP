from datetime import datetime
from typing import Dict, List, Any

# Knowledge base for Pakistan's historical crisis patterns
PAKISTAN_CRISIS_KNOWLEDGE = {
    "floods": {
        "seasonal_months": [6, 7, 8, 9],  # June to September (Monsoon)
        "vulnerable_regions": {
            "Sindh": ["riverine"],
            "Punjab": ["riverine"],
            "KPK": ["flash", "riverine"],
            "Balochistan": ["flash"],
            "Gilgit-Baltistan": ["flash", "glof"]
        }
    },
    "earthquakes": {
        "seismic_zones": [
            "Quetta", "Ziarat", "Chaman", "Peshawar", "Islamabad", "Murree", 
            "Muzaffarabad", "Gilgit", "Skardu", "Makran Coast"
        ]
    },
    "protests": {
        "hotspots": ["Islamabad", "Karachi", "Lahore", "Peshawar", "Quetta", "Multan", "Faisalabad"]
    },
    "roadblock": {
        "vulnerable_routes": [
            "Karakoram Highway", "N-35", "N-5", "M-2", "Lowari Tunnel", "Babusar Pass"
        ]
    }
}

def check_historical_plausibility(category: str, location: str, date: datetime = None) -> Dict[str, Any]:
    """
    Check if a reported crisis is plausible based on historical patterns in Pakistan.
    """
    if not date:
        date = datetime.now()
    
    score = 100
    reasoning = []
    category = category.lower()
    
    # Flood Plausibility
    if "flood" in category:
        # Check season
        if date.month in PAKISTAN_CRISIS_KNOWLEDGE["floods"]["seasonal_months"]:
            score = 100
            reasoning.append("Report aligns with Pakistan's monsoon season (June-Sept).")
        else:
            # Low plausibility outside monsoon, unless it's GB (glacial melt)
            if "Gilgit" in location or "Skardu" in location or "Baltistan" in location:
                score = 80
                reasoning.append("Flood in this region may be due to glacial melt (GLOF) even outside peak monsoon.")
            else:
                score = 40
                reasoning.append(f"Flooding is less common in {date.strftime('%B')} outside monsoon season.")
        
        # Check region match
        region_matched = False
        for province, types in PAKISTAN_CRISIS_KNOWLEDGE["floods"]["vulnerable_regions"].items():
            if province.lower() in location.lower():
                region_matched = True
                reasoning.append(f"Location {location} is in a known flood-vulnerable province ({province}).")
                break
        
        if not region_matched:
            score -= 20
            reasoning.append("Location is not historically recognized as a primary flood-prone zone.")

    # Earthquake Plausibility
    elif "earthquake" in category or "quake" in category:
        zone_match = any(zone.lower() in location.lower() for zone in PAKISTAN_CRISIS_KNOWLEDGE["earthquakes"]["seismic_zones"])
        if zone_match:
            score = 100
            reasoning.append("Location is within a known high-seismic activity zone in Pakistan.")
        else:
            score = 70 # Earthquakes can happen anywhere, but less likely in some areas
            reasoning.append("Location is outside major historical high-intensity seismic fault lines.")

    # Protest Plausibility
    elif "protest" in category or "dharna" in category:
        hotspot_match = any(city.lower() in location.lower() for city in PAKISTAN_CRISIS_KNOWLEDGE["protests"]["hotspots"])
        if hotspot_match:
            score = 100
            reasoning.append("Reported location is a frequent hotspot for public demonstrations.")
        else:
            score = 80
            reasoning.append("Protests occur frequently but are less common in this specific area.")

    # Roadblock Plausibility
    elif "road" in category or "block" in category:
        route_match = any(route.lower() in location.lower() for route in PAKISTAN_CRISIS_KNOWLEDGE["roadblock"]["vulnerable_routes"])
        if route_match:
            score = 100
            reasoning.append("This route is historically prone to blockages due to terrain or weather.")
        else:
            score = 90 # Roadblocks are dynamic
            reasoning.append("Roadblock reported in a non-standard zone; requires further confirmation.")

    return {
        "score": max(0, score),
        "plausibility": "High" if score >= 80 else "Medium" if score >= 50 else "Low",
        "reasoning": reasoning
    }
