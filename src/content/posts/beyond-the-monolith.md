---
title: 'Beyond the Monolith: What Changes When You Split It Up'
blurb: 'Splitting a monolith takes a sprint. Knowing whether any of it needed splitting — and living with what microservices actually cost — takes a lot longer.'
pubDate: 2026-09-25
tags: ['Microservices', 'System Design', 'Distributed Systems', 'Architecture']
draft: false
---

Splitting a monolith into services is deceptively easy to start and deceptively
hard to stop halfway through. You draw some boxes around bounded contexts,
stand up a few new repos, and put a message queue between them. That part takes
a sprint. The part that actually matters — deciding whether any of it should
have happened, and living with what it costs once it has — takes a lot longer,
and it's where most of the real argument lives.

It's worth walking through a composite scenario rather than a real one, since
this exact story plays out often enough in postmortems that the specifics barely
matter — only the shape of what goes wrong and right does. Picture a mid-sized
retail platform: a single Rails monolith handling catalog, checkout, inventory,
and notifications, run by a team of twelve. Growth pressure and a few painful
deploy freezes push them toward a rewrite, and within two quarters they've split
it into eleven services — catalog, pricing, cart, checkout, payments,
inventory, fulfillment, notifications, search, recommendations, and an API
gateway — talking over gRPC with Kafka as the event backbone, each with its own
datastore, all on Kubernetes.

## Drawing boundaries is the easy 20%, running the seams is the hard 80%

Deciding where catalog ends and pricing begins is an afternoon of whiteboard
work and genuinely satisfying to get right. The hard part starts the moment
those eleven services actually have to run. Local development now means a
docker-compose file with eleven containers instead of one Rails server. A
feature that touches checkout and inventory needs coordinated deploys across two
repos instead of one pull request. Debugging a slow request means following a
trace across four services instead of reading a stack trace. The team of twelve,
who used to ship without much ceremony, now needs on-call rotations, SLOs, and a
service mesh just to keep eleven runtimes healthy — which in practice means
someone has to become a part-time platform team, whether or not anyone signed
up for that.

## A network call changes what "a bug" costs

In the monolith, a checkout failure was an exception with a stack trace pointing
at one line. Once checkout, payments, and inventory are separate services
talking over the network, that same failure becomes a question with several
parts: which of the three services actually failed, whether the retry logic
double-charged the customer, and whether the compensating transaction on
inventory ran to release the reserved stock. None of that is a bug in the old
sense — it's a distributed-systems problem, and it needs the tools for one:
idempotency keys on payment calls, a saga pattern for the multi-step checkout
transaction, circuit breakers so one slow service doesn't take the rest down
with it. A team that hasn't budgeted for that tooling doesn't avoid these
failure modes by splitting up — it just discovers them in production instead of
in design.

## Benchmark the split against a ladder of cheaper alternatives

Before committing to a rewrite, it's worth pricing out what a cheaper ladder of
options would have bought the team — the same instinct as testing a
sophisticated model against a simple baseline before trusting it. A modular
monolith with enforced module boundaries and no cross-module SQL joins is rung
one. Read-replicating the database to isolate the reporting load is rung two.
Extracting only the one or two components with a genuinely different scaling or
release profile is rung three. Full decomposition is the last rung, not the
first.

In this composite case, three of the four original pain points — slow deploys, a
noisy reporting query competing with checkout traffic, and a search index that
needed different infrastructure than the rest of the app — could have been
solved by rungs two and three without touching checkout or payments at all. The
one component that genuinely earned its own service was recommendations: it
retrained daily, needed bursty GPU capacity, and shipped on its own schedule
regardless of what the rest of the platform was doing. Everything else was
decomposed because the team was already mid-rewrite and momentum said "while
we're at it," not because checkout and payments had different operational needs
from each other.

## The real skill is drawing the line, not avoiding it

The useful question was never "monolith or microservices" as a category — it's
which specific boundary is expensive enough right now to justify paying for a
network hop, a new datastore, and a new on-call rotation. A boundary earns that
cost when a component's scaling profile, release cadence, or team ownership
genuinely diverges from the rest of the system. Most boundaries in most systems
don't clear that bar; a few do. A modular monolith gets most of the
organizational benefit — independent ownership, enforced interfaces — for a
fraction of the operational bill, and it's the right default until a specific
service is straining against it in a specific, nameable way. Splitting
everything at once because you're already in the codebase is how a team of
twelve ends up running a platform team it never meant to build.