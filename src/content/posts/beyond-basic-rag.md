---
title: 'Beyond Basic RAG: What Changes When You Add Agents'
blurb: 'Basic RAG takes an afternoon. Knowing whether it retrieves the right things — and building agents that act rather than answer — took a lot longer.'
pubDate: 2026-08-14
tags: ['RAG', 'LLM Engineering', 'Multi-agent', 'Evaluation']
draft: false
---

Basic RAG is deceptively easy to get working and deceptively hard to get right.
You embed some documents, stuff the top-k results into a prompt, and it answers
questions about your data. That part takes an afternoon. The part that actually
matters — knowing whether it's retrieving the right things, and building a
system that can act rather than just answer — took a lot longer, and it's where
most of what I learned actually happened.

I built this as a self-contained project: an autonomous deal-finding system
made of seven agents that each own a narrow piece of the problem — pulling
listings from RSS feeds with schema-validated extraction, estimating fair
prices, and flagging genuine deals. It sounds like a toy use case, but it forced
every problem you'd hit in a "real" agentic system: noisy input, models that
disagree with each other, and a pipeline where a mistake early on quietly
poisons everything downstream.

## RAG is the easy 80%, evaluation is the hard 20%

The retrieval piece sits on a Chroma store with roughly 400,000 vectors of
historical pricing data. Getting embeddings in and getting a cosine-similarity
search out was not the hard part. The hard part was answering, with something
more rigorous than vibes, whether the retrieved context was actually good.

I ended up building a small evaluation harness rather than trusting spot checks:
MRR and nDCG for the retrieval quality itself, and an LLM-as-judge rubric for
whether the final answer was actually well-supported by what got retrieved. That
harness is what exposed the real problem — retrieval was fine on average and bad
on the cases that mattered, the weird or ambiguous listings where a naive top-k
match pulled semantically similar but practically irrelevant items.

Fixing that meant rebuilding the pipeline with semantic chunking instead of
fixed-size windows, over-retrieving a wider candidate set than I needed, and
adding an LLM re-ranking pass on top before anything reached the final prompt.
None of those show up in a basic RAG tutorial, and all three mattered more than
the embedding model choice.

## Tool calling changes what "wrong" looks like

Once an agent can call tools — hit an API, query a database, hand off to another
agent — a wrong answer stops being just an unhelpful response and starts being
an unhelpful action. That changes how you have to think about failure modes. A
pure chat model that misunderstands a question gives you a bad paragraph. An
agent that misunderstands a question and then calls a pricing tool with the
wrong parameters, or hands a malformed payload to the next agent in the chain,
can cascade.

For the price-estimation piece specifically, I didn't rely on a single model.
There's a RAG-based estimator grounded in comparable listings, a QLoRA
fine-tuned Llama 3.2 3B running as a specialist model on serverless GPU, and a
PyTorch regressor trained on structured features. An ensemble blends the three.
The fine-tuning itself needed an 800,000-item corpus, and getting that corpus
balanced across categories mattered more than I expected — an unbalanced
training set quietly taught the small model to be confidently wrong on the
categories it saw least, which is a much scarier failure than being visibly
uncertain.

I benchmarked all of it against a baseline ladder — linear regression,
bag-of-words, random forest, XGBoost, and zero-shot frontier models —
specifically so I couldn't fool myself into thinking the fancy multi-model
ensemble was working just because it produced plausible-looking numbers. A few
times, a simpler baseline beat a more sophisticated approach on a specific slice
of the data, which was a useful reminder not to reach for a bigger model as the
default fix.

## Orchestration is where the real engineering is

With seven agents, the interesting problems stopped being about any individual
model and became about the seams between them: what happens when the RSS
ingestion agent gets a malformed feed, how confident does the price-estimation
ensemble need to be before a deal gets flagged, what's the fallback when the
fine-tuned model's serverless GPU cold-starts mid-pipeline. None of that is
prompt engineering. It's closer to regular distributed-systems thinking, just
with a probabilistic component sitting at each node instead of a deterministic
one.

That's the biggest shift from basic RAG to something agentic:
retrieval-augmented generation is fundamentally about improving one model's
answer. Multi-agent orchestration is about designing a system where each
component can be individually wrong sometimes and the overall system still
behaves reasonably. Getting comfortable with that — building in evaluation,
redundancy, and graceful degradation rather than chasing a single model that
never fails — was the actual lesson here, not any particular framework or
technique.
