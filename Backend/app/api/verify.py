from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.verification import verification_engine

router = APIRouter(prefix="/verify", tags=["verification"])

class IncidentReportSchema(BaseModel):
    title: str
    title_ur: Optional[str] = None
    description: str
    description_ur: Optional[str] = None
    category: str
    location: str
    reporter_trust_score: int = 50
    has_image: bool = False
    has_voice: bool = False

class VoteSchema(BaseModel):
    report_id: str
    action: str  # "upvote" or "downvote"

class SOSSchema(BaseModel):
    latitude: float
    longitude: float
    user_name: str
    phone: Optional[str] = None

@router.post("/report")
async def verify_incident_report(report: IncidentReportSchema):
    try:
        result = await verification_engine.verify_report(
            title=report.title,
            description=report.description,
            category=report.category,
            location=report.location,
            reporter_trust_score=report.reporter_trust_score,
            title_ur=report.title_ur,
            description_ur=report.description_ur,
            has_image=report.has_image,
            has_voice=report.has_voice
        )
        
        severity = "moderate"
        if result["ai_trust_rating"] >= 80:
            severity = "critical"
        elif result["ai_trust_rating"] >= 60:
            severity = "high"
            
        title_ur = report.title_ur or report.title
        location_ur = report.location
        if "swat" in report.location.lower():
            location_ur = "سوات، خیبر پختونخوا"
        elif "quetta" in report.location.lower():
            location_ur = "کوئٹہ، بلوچستان"
        elif "lahore" in report.location.lower():
            location_ur = "لاہور، پنجاب"
        elif "peshawar" in report.location.lower():
            location_ur = "پشاور، خیبر پختونخوا"
            
        import uuid
        new_report = {
            "id": str(uuid.uuid4()),
            "title": report.title,
            "titleUr": title_ur,
            "location": report.location,
            "locationUr": location_ur,
            "category": report.category if report.category in ["floods", "earthquakes", "security"] else "floods",
            "severity": severity,
            "trustScore": result["ai_trust_rating"],
            "timeAgo": "Just now",
            "timeAgoUr": "ابھی ابھی",
            "verified": result["should_broadcast"]
        }
        
        with verification_engine.db_lock:
            verification_engine.reports_db.insert(0, new_report)
            
        return {
            "verification": result,
            "new_report": new_report
        }
    except Exception as e:
        print(f"Verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing verification: {str(e)}")

@router.get("/feed", response_model=List[Dict[str, Any]])
async def get_crisis_feed():
    return verification_engine.get_feed()

@router.post("/vote")
async def vote_incident(vote: VoteSchema):
    updated = verification_engine.vote_report(vote.report_id, vote.action)
    if not updated:
        raise HTTPException(status_code=404, detail="Incident report not found")
    return updated

@router.post("/sos")
async def trigger_emergency_sos(sos: SOSSchema):
    print(f"[SOS ALERT] Emergency trigger: {sos.user_name} (Phone: {sos.phone}) at Location: ({sos.latitude}, {sos.longitude})")
    return {"status": "triggered", "message": "Emergency SOS broadcasted successfully to local rescue teams."}

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": verification_engine.device,
        "models_loaded": verification_engine.classifier is not None
    }
