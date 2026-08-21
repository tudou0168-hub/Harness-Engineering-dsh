# DSH Plugin Development Map

## 1. Plugin is the primary extension unit

Official development model:

A plugin exports an apply function. Harness loads the plugin and passes a Cordis context object. The plugin registers capabilities through ctx.

Example concepts:

```ts
export const name = 'my-plugin'

export function apply(ctx) {
  // register capabilities
}
```

## 2. Service dependency model

Plugins consume capabilities through inject.

Examples:

- tools
- llm
- agents

A plugin should not directly couple to another plugin implementation. It consumes services.

## 3. Event model

Cordis events are the loose-coupling communication layer.

Use:

- emit: broadcast
- bail: interception
- serial: ordered processing
- waterfall: pipeline transformation

## 4. Packaging model

Development path:

local plugin
  -> patch overlay
  -> bundle
  -> profile
  -> reusable installation

## 5. Engineering implication for Laoli projects

Custom UI:

Plugin + UI capability

Professional Agent:

Preset + Skill + Tool + externalized project state

Enterprise Workspace:

Plugin + UI + multiple Agent compositions

Avoid modifying Core unless an extension point is genuinely missing.
