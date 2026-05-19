# Resq AI Trust Score: Models, Workflow & Datasets Guide

This document explains the architecture, models, operational workflows, and data sources used to calculate the real-time AI Trust Score for reported incidents.

---

## 1. AI Models Architecture

The verification backend utilizes two powerful local natural language processing (NLP) models from the Hugging Face Transformers ecosystem:

### A. Zero-Shot Classifier
* **Model ID**: `MoritzLaurer/mDeBERTa-v3-base-mnli-xnli`
* **Type**: Multilingual NLI (Natural Language Inference)
* **Role**: Evaluates descriptions to determine factuality versus potential misinformation. It classifies text across 5 dynamic labels without requiring explicit dataset fine-tuning:
  * `"factual crisis report"` (Positive weight)
  * `"fake news"` (Negative weight)
  * `"sensationalist misinformation"` (Negative weight)
  * `"spam"` (Negative weight)
  * `"opinion"` (Neutral/Low weight)

### B. Translation Consistency Model
* **Model ID**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
* **Type**: Multilingual Sentence-Transformers Embeddings
* **Role**: Encodes English and Urdu texts into language-agnostic **384-dimensional dense vectors**.
* **Method**: Calculates the **Cosine Similarity** between English and Urdu vectors to verify translation alignment and detect semantic tampering.

---

## 2. Dynamic Heuristic Fallbacks

To ensure **100% server uptime** (e.g. if offline, or if models are currently downloading in the background), the system features high-fidelity heuristic fallbacks:

* **Fallback Classifier (`_fallback_nlp_classify`)**: Scans keyword densities, vocabulary details, structural lengths, and markers to predict zero-shot classification probabilities in milliseconds.
* **Bilingual Contradiction Checker (`_fallback_bilingual_consistency`)**: Extracts and compares digits, numbers, and key context variables from English and Urdu descriptions to detect structural discrepancies (e.g. "500 protesters" in English vs "20 protesters" in Urdu).

---

## 3. The 5-Step Trust Score Calculation Workflow

When an incident report is submitted, the engine evaluates it across 5 weighted sub-components:

```
                  ┌──────────────────────────────────────────────┐
                  │          Incident Report Submission          │
                  └──────────────────────┬───────────────────────┘
                                         │
       ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
       ▼                  ▼              ▼              ▼                  ▼
┌──────────────┐   ┌──────────────┐┌────────────┐┌──────────────┐   ┌──────────────┐
│  Linguistic  │   │   Zero-Shot  ││ Historical ││ Bilingual-Sim │   │   Reporter   │
│  Analysis    │   │  Classifying ││ Plausible  ││ Consistency  │   │  Reputation  │
│  (25% Wt)    │   │   (30% Wt)   ││  (20% Wt)  ││   (15% Wt)   │   │   (10% Wt)   │
└──────┬───────┘   └──────┬───────┘└────┬───────┘└──────┬───────┘   └──────┬───────┘
       │                  │              │              │                  │
       └──────────────────┼──────────────┼──────────────┴──────────────────┘
                          ▼
             ┌───────────────────────────┐
             │    Weighted Aggregation   │
             └────────────┬──────────────┘
                          │ (Media Evidence Bonus up to +5%)
                          ▼
             ┌───────────────────────────┐
             │   Final AI Trust Rating   │
             │         (0 - 100%)        │
             └───────────────────────────┘
```

### The 5 Valuation Components:
1. **Zero-Shot Classification (30% Weight)**: Assesses if the description aligns with a `"factual crisis report"` category.
2. **Linguistic Markers (25% Weight)**: Flags clickbait, hyperbole (e.g. "apocalyptic", "government is hiding"), ALL CAPS, and excessive exclamation marks while rewarding explicit details (numbers/dates).
3. **Historical Plausibility (20% Weight)**: Matches the category against Pakistan's seasonal trends (e.g. June-September monsoon for floods).
4. **Bilingual Semantic Similarity (15% Weight)**: Ensures the English and Urdu versions are structurally and semantically identical.
5. **Reporter Reputation (10% Weight)**: Pulls the historic trust score of the reporting community member.

---

## 4. Dataset Directory & Folder Structure

### A. Model Weight Cache (Local Drive)
Hugging Face model weights are downloaded from the official repository and cached globally on the host computer:
* **Cache Path**: `C:\Users\Rana PC\.cache\huggingface\hub\`
* **Benefits**: Enables zero-latency startup and complete offline operation on subsequent runs.

### B. Code & Knowledge Base Structure
All AI verification files are located within the `Backend/app/services` directory:

```
c:/Users/Rana PC/OneDrive/Desktop/Resq/
├── Backend/
│   ├── main.py                          <-- Root entry point (Uvicorn target)
│   └── app/
│       ├── main.py                      <-- Core FastAPI configuration
│       └── services/
│           ├── verification.py          <-- Main verification engine and fallbacks
│           ├── crisis_patterns.py       <-- Pakistan Crisis seasonal knowledge base
│           └── linguistic_markers.py    <-- Emotional hyperbole & clickbait regex rules
```

* **Crisis Knowledge Base (Local Dataset)**: Located directly in `crisis_patterns.py` as a localized database dict `PAKISTAN_CRISIS_KNOWLEDGE` covering Pakistan's seismic zones, monsoon months, flash flood-prone districts, and highway routes.
