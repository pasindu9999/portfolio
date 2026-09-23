---
title: 'AI PDF Chatbot'
blurb: 'A PDF question-answering system built from first principles — hybrid retrieval, rank fusion, re-ranking and page-level citations, tuned by a 45-config sweep.'
tags:
  [
    'Python',
    'Streamlit',
    'ChromaDB',
    'ONNX Runtime',
    'Ollama',
    'Gemini API',
    'pytest',
  ]
cover: '../../assets/projects/ai-pdf-chatbot.png'
coverAlt: 'Typographic cover: a retrieval benchmark ladder rising to recall@5 of 1.000.'
year: 2026
role: 'Sole engineer'
timeline: '2026'
context: 'Retrieval-augmented generation system'
repo: 'https://github.com/pasindu9999/AI-chatbot'
featured: true
order: 2
---

A PDF question-answering system built **from first principles** rather than
assembled from an off-the-shelf RAG framework: custom chunking, hybrid vector
and BM25 retrieval, rank fusion, re-ranking and page-level citations.

Roughly **6,500 lines of Python** and **113 automated tests**.

## Why build the pipeline by hand

Everything sits behind typed protocols. That made it possible to run a
**45-configuration benchmark sweep** without changing the pipeline itself —
swapping retrievers, chunkers and models as implementations of the same
interface rather than as forks of the code.

## Measuring instead of guessing

Built a retrieval evaluation harness scoring **precision@k, recall@k, MRR and
nDCG** over a 29-question ground-truth set, and used it to pick defaults from
measurement rather than intuition.

- Hybrid retrieval raised **recall@5 from 0.962 to 1.000**
- A controlled **3B / 3.8B / 20B** comparison isolated multi-source conflict
  detection as a model-capability limit rather than a retrieval failure — so it
  was mitigated with a deterministic detector instead of a larger model

## What I took from it

Knowing *which layer* a failure belongs to is most of the work. The 3B/3.8B/20B
comparison mattered because it ruled out the fix everyone reaches for first —
throw a bigger model at it — and pointed at a cheaper, deterministic answer.
