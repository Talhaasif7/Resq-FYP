import re
from typing import Dict, List, Any

# Linguistic markers for fake news/sensationalism
ENGLISH_HYPERBOLE = [
    r"catastrophic", r"unprecedented", r"millions (dead|affected|homeless)", 
    r"absolute (carnage|chaos|disaster)", r"never seen before", r"complete destruction",
    r"government is lying", r"mainstream media won't tell you", r"emergency!!!",
    r"total wipeout", r"apocalyptic"
]

URDU_HYPERBOLE = [
    r"تباہی", r"قیامت", r"لاکھوں", r"ہلاکتیں", r"خون کی ندیاں", 
    r"حکومت چھپا رہی ہے", r"میڈیا خاموش ہے", r"افراتفری", r"بربادی",
    r"لاشوں کے ڈھیر", r"انتہائی خطرناک", r"فوری شئیر کریں"
]

VAGUENESS_INDICATORS = [
    r"someone said", r"I heard", r"people are saying", r"a source claims",
    r"فلان نے کہا", r"سنا ہے کہ", r"لوگ کہہ رہے ہیں"
]

def analyze_linguistic_markers(text_en: str, text_ur: str = "") -> Dict[str, Any]:
    """
    Analyze text for linguistic markers of fake news, hyperbole, and vagueness.
    """
    flags = []
    hyperbole_count = 0
    vagueness_count = 0
    evidence_score = 0
    
    combined_text = f"{text_en} {text_ur}"
    
    # Check for hyperbole in English
    for pattern in ENGLISH_HYPERBOLE:
        if re.search(pattern, text_en, re.IGNORECASE):
            hyperbole_count += 1
            flags.append(f"Hyperbole detected: '{pattern}'")

    # Check for hyperbole in Urdu
    if text_ur:
        for pattern in URDU_HYPERBOLE:
            if re.search(pattern, text_ur):
                hyperbole_count += 1
                flags.append(f"Urdu Sensationalism: '{pattern}'")

    # Check for vagueness
    for pattern in VAGUENESS_INDICATORS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            vagueness_count += 1
            flags.append("Vague sourcing/hearsay markers found")

    # Check for factual evidence (numbers, dates, names)
    # Simple regex for numbers/dates
    numbers = re.findall(r"\d+", combined_text)
    if len(numbers) > 0:
        evidence_score += min(len(numbers) * 10, 40) # Up to 40 points for numbers
        
    # Check for specific place names (capitalized words in English or specific Urdu markers)
    # Very basic check
    places = re.findall(r"\b[A-Z][a-z]+\b", text_en)
    if len(places) > 1: # Usually location is one, more might indicate context
        evidence_score += 20

    # Emotional manipulation (Excessive punctuation, Caps)
    if re.search(r"!{2,}", combined_text):
        flags.append("Excessive exclamation marks (!!!)")
        hyperbole_count += 1
        
    if text_en.isupper() and len(text_en) > 20:
        flags.append("ALL CAPS detected (Urgent/Shouting)")
        hyperbole_count += 1

    # Calculate final linguistic score (0-100)
    # Starts at 100, drops for flags, gains for evidence
    base_score = 70 # Neutral start
    penalty = (hyperbole_count * 15) + (vagueness_count * 20)
    bonus = evidence_score
    
    final_score = base_score - penalty + bonus
    
    return {
        "score": max(0, min(100, final_score)),
        "hyperbole_flags": hyperbole_count,
        "vagueness_flags": vagueness_count,
        "evidence_score": evidence_score,
        "flags": flags
    }
