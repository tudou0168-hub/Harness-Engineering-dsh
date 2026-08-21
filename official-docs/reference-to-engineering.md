# Official Reference -> Engineering Interpretation

## Subsystems

The official reference separates DSH into subsystem documentation rather than one monolithic framework.

Important areas:

- core / agent-loop
- session
- system prompt
- tools
- skills
- subagent
- workflow
- storage
- sandbox
- token meter
- UI related capabilities

## Why this matters

When a problem appears, do not ask:

'How do I modify DSH?'

Ask:

'Which capability layer owns this behavior?'

## Diagnosis model

UI issue:

Plugin / UI capability / profile

Agent behavior issue:

Prompt / Runtime Context / Skill / Tool exposure

Persistence issue:

Session / Storage / Externalized state

Long task issue:

Subagent / Workflow / Continuation

Capability missing:

Plugin extension point first

Core modification last

## Application direction

This research supports building:

- personal AI workspace
- enterprise AI workspace
- PPT production Agent
- document Agent
- government service Agent

The goal is not to reproduce DSH. The goal is to use DSH as an extensible Agent operating system.
