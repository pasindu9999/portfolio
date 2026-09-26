---
title: 'Agentic AI & LLM Engineering'
blurb: 'An autonomous deal-finding system of seven collaborating agents, combining RAG over 400k vectors, a QLoRA fine-tuned Llama 3.2 3B and a PyTorch regressor.'
tags:
  [
    'Python',
    'PyTorch',
    'HuggingFace Transformers',
    'QLoRA / PEFT',
    'ChromaDB',
    'LangChain',
    'Modal',
    'Gradio',
    'Weights & Biases',
  ]
cover: '../../assets/projects/agentic-ai.png'
coverAlt: 'Typographic cover: seven agent nodes converging on a single ensemble output.'
year: 2026
role: 'Sole engineer'
timeline: '2026'
context: 'Self-directed engineering project'
category: 'AI & ML'
status: 'in-progress'
featured: true
order: 2
---

An eight-module applied LLM engineering curriculum worked through as a single
compounding Python codebase — from frontier API calls to a deployed multi-agent
system.

## The system

An autonomous deal-finding system built from **seven collaborating agents**:

- RSS ingestion with schema-validated extraction
- RAG-based price estimation over a **400,000-vector Chroma store**
- A **QLoRA fine-tuned Llama 3.2 3B** specialist served on serverless GPU
- A PyTorch regressor
- An ensemble blending all three model families

## Training data

Curated an **800,000-item training corpus** with category rebalancing and
versioned train/validation/test splits, then benchmarked every model against a
deliberate baseline ladder — linear regression, bag-of-words, random forest,
XGBoost and zero-shot frontier models — so that any claimed improvement was
measured against something honest rather than against nothing.

## Evaluation

Built a RAG evaluation harness scoring retrieval with **MRR and nDCG**, and
answer quality against an **LLM-as-judge** rubric. The pipeline was then rebuilt
on the evidence: semantic chunking, over-retrieval, and LLM re-ranking.

## What I took from it

The interesting work was not the model — it was the measurement. Having a
baseline ladder and a scored evaluation harness in place first is what made it
possible to tell an actual improvement from a plausible-sounding one.
