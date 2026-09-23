---
title: 'Moving Off the Monolith: Notes From a Clean Architecture Migration'
blurb: 'Map the real dependency graph before you draw the target one. Notes from strangling a .NET monolith into Clean Architecture without taking it down.'
pubDate: 2026-06-05
tags: ['Architecture', '.NET', 'Clean Architecture', 'Refactoring']
draft: false
---

I didn't set out to rewrite the system. I set out to add one feature, and the
estimate kept growing because every change touched four other things that had
nothing to do with it. That's usually the actual trigger for these migrations —
not an architecture diagram someone drew on a whiteboard, but the slow
realization that the codebase is actively working against you.

The project was a monolith that had grown the normal way: reasonably clean at
the start, then a few years of deadlines, a few departures on the team, and a
lot of "just add it to the service that's already there." Controllers were
calling into business logic that was calling into other business logic that was
reaching straight into EF Core contexts three layers away. Nobody had done
anything wrong on any individual day. It just accumulated.

## The first problem was figuring out what depended on what

Before touching a single file, I needed a real picture of the dependency graph,
not the one in my head. I used a mix of static analysis (NDepend, and later just
grepping for `using` statements across namespaces to sanity-check the tool's
output) to find the actual coupling. The results were humbling. A
"notifications" module that should have been a leaf node was being referenced by
six other modules, and it referenced three of them back. That's not a layer,
that's a knot.

This is the part people underestimate about these migrations: the design work
isn't drawing the target architecture, it's mapping the current one honestly.
Once I had the real graph, the target Clean Architecture layers — Domain,
Application, Infrastructure, Presentation, with dependencies only pointing
inward — were almost the easy part conceptually. Getting there was the hard
part.

## Keeping the lights on while you rebuild the plane

The system couldn't go down for a rewrite, and a big-bang cutover was never on
the table given the risk. So the approach was strangler fig, applied at the
module level rather than the request level: pick one bounded context, carve it
out behind interfaces, migrate its internals into the new layering, and leave
everything else in the monolith pointing at the old implementation until the new
one was proven.

In practice that meant a lot of temporary ugliness. I'd define a port (an
interface) in the Application layer for something like `IPricingService`,
implement it with an adapter that just delegated to the legacy code, and only
later swap that adapter for a real implementation built against the new Domain
model. Some of those adapters lived for months. That felt wrong every time I
looked at them, but it was the price of not breaking the app for existing users
while the seams were still being cut.

Feature flags did a lot of quiet work here too — not for user-facing
functionality, but for routing between "old path" and "new path" for a given
module, so a bad migration could be reverted in minutes instead of requiring a
redeploy under pressure.

## Breaking coupling is a series of small, annoying decisions

The tight coupling wasn't one big problem, it was dozens of small ones: services
taking dependencies on concrete classes instead of interfaces, domain logic that
assumed a specific ORM was present, shared database tables that two "separate"
modules both wrote to directly. Each of these needed its own fix — introduce an
interface here, add an anti-corruption layer there, and in a few uncomfortable
cases, duplicate a table temporarily and write to both until a proper migration
script could reconcile the data.

The shared-table problem was the one that actually scared me. Two modules
writing to the same table meant they weren't really separate modules no matter
what the folder structure said. Untangling that required picking an owner for
the data, giving the other module a proper API or event to consume instead of
direct access, and accepting a short window where writes went through both the
old and new paths so nothing silently diverged.

## What I'd tell someone starting this

Do the dependency mapping first, and don't trust your intuition about what's
coupled to what — the surprises are usually bigger than expected. Migrate by
bounded context, not by layer; trying to build a global "clean" Infrastructure
layer before any single feature works end to end just means a long stretch with
nothing shippable. And budget real time for the boring parts — reconciling
duplicated data, writing adapters you'll delete later, testing that the old and
new paths actually produce the same result. Nobody puts those in the
architecture diagram, but they're most of the actual work.

The system today is faster to change, and I trust it more when I touch it. It's
not fully migrated — there's still a chunk of the original monolith running
under an interface, quietly being strangled a bit more every sprint.
