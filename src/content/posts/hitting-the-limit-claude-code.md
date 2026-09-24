---
title: "Hitting the Limit: How I Stopped Burning Through Claude Code"
blurb: "Running out of usage mid-task is annoying. Working out why it kept happening, and what actually stretches a session, changed how I work with coding agents."
pubDate: 2026-03-18
tags: ["Claude Code", "LLM Engineering", "Developer Tools", "Cost Optimization"]
draft: false
---

Hitting your usage limit in Claude Code is deceptively easy and deceptively
annoying. You start a session, things go well, and then somewhere in the middle
of a refactor you're told to come back later. The first few times I blamed the
limit. Eventually I realised the limit wasn't the problem. I was spending
tokens carelessly, and I couldn't see where they were going.

Around March 2026 this became a real bottleneck for me, so I stopped treating
it as bad luck and started treating it like any other resource constraint.
What follows is what actually moved the needle.

## Match the model to the task

The most obvious mistake, and the one I made longest, was defaulting to the
biggest model for everything. Most of what I do in a coding session doesn't
need it. Sonnet handles the bulk of day-to-day coding well, and I save Opus for
the two places it earns its cost: planning, and debugging that has resisted
everything else. Haiku covers simple edits and the grunt work I hand off to
subagents, like renaming things, mechanical changes and boilerplate.

The shift in thinking is that model choice is a per-task decision, not a
per-project setting. Once I started asking "does this actually need the
expensive model?", the answer was usually no.

## Fixed overhead is a tax on every session

Some costs don't depend on what you ask. Your `CLAUDE.md` is loaded at the
start of every session, so every line in it is paid for every time. Mine had
grown into a dumping ground of preferences and notes, and cutting it down to
what genuinely needs to be there was free savings.

MCP servers are the same kind of hidden cost. Their tool definitions count
against your context on every turn, whether or not you use them. A server you
connected for one task three weeks ago is still taxing every message you send.
Now I only keep on the ones I need for the work at hand.

## Don't break the cache

This was the least intuitive lesson. Prompt caching makes long sessions
affordable, but it's fragile. Switching models or editing `CLAUDE.md`
mid-session invalidates the cache, so the next turn pays full price to rebuild
context that was previously cheap.

The fix is a habit, not a tool: make those changes at session boundaries. If I
want a different model or a tweak to my instructions, I finish what I'm doing
and start fresh rather than changing things halfway through.

## Prompt precisely

Vague prompts are expensive prompts. "Look through the repo and find where
this breaks" sends the agent exploring, reading files that have nothing to do
with the problem. Pointing at a specific file, function or line cuts that
exploration to almost nothing, and the answer is usually better too.

Two other habits pay for themselves. Plan mode first means I agree on the
approach before any code is written, so I don't pay for a wrong implementation
and then pay again to undo it. And pressing Esc early, the moment I see the
agent heading somewhere wrong, is far cheaper than letting it finish and then
explaining why it was wrong.

## Parallelism and thinking are multipliers

Multiple agents and long autonomous loops are the fastest way I know to hit a
limit, because they multiply everything above. Each extra agent brings its own
context, its own tool calls and its own mistakes. I still use them, but
deliberately, on tasks where the parallel speedup is worth the cost, not as a
default.

Thinking effort works the same way. A simple task doesn't need deep reasoning,
so lowering the effort for those is an easy saving I'd been ignoring.

## Tokens are a budget, so design for it

It's easy to treat this as a list of tips, but the real change was in my mental
model. Context isn't free, and neither is a mistake. A wrong turn early in a
session gets paid for repeatedly as it sits in context and shapes everything
after it. That's the same lesson I took from building agentic systems: the
cheapest failure is the one you catch early.

None of these tricks is clever on its own. What worked was being deliberate
about where the tokens go, and not reaching for a bigger model, a longer loop
or a wider search as the default fix.
