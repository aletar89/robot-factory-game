# Robot Factory Game

A lightweight React prototype that captures the game loop for a robotics automation tycoon. The app visualizes
robots as the top of a branching production tree, lets you research parts to unlock deeper crafting, and
simulates automation rules for buying and selling inventory. This document is the living specification for the
experience and includes deployment notes for Render.

## Vision

* **Start manual, grow automated**: You begin by ordering premium-priced parts and hand-assembling a single robot.
* **Branching tech tree**: Each part (frame, powertrain, control core, mobility rig, etc.) unlocks subparts through
  research. Research costs money but reveals cheaper ways to produce parts instead of buying them.
* **Economic tension**:
  * You may buy any part (including finished robots) at a premium price, but buying and reselling should never be profitable.
  * Assembled items sell for more than the sum of their inputs; building is always better than buying.
* **Automation knobs**: Every part can define a purchase rate and a sell-down rule (e.g., "sell everything above 2"). Running an automation cycle executes those instructions.
* **Selling robots**: Finished robots can be sold for more than their bill of materials, or assigned back into the factory loop as production capacity.

## Current prototype

The included React UI is a starting point for the spec:

* Visual **tree layout** with a robot at the top and researchable components branching downward.
* Each node shows buy price (premium), sale price, and the aggregate parts cost to assemble it.
* **Research buttons** unlock nodes so they can be bought, assembled, or automated.
* **Assembly button** consumes the required subparts from inventory when available.
* **Buy at premium** allows ordering any unlocked part directly, even robots, at a cost that is always higher than
  both selling and self-assembling it.
* **Automation cycle** applies per-part purchase rates and sell-down thresholds in one click.
* Prices follow the rules above: sale price > sum of required parts, buy price > sale price to prevent arbitrage.

## Gameplay rules encoded in this spec

* **Parts list**
  * Robot: frame assembly, powertrain, control core, mobility rig
  * Frame assembly: frame shell, fastener kit, wiring harness
  * Powertrain: battery array (cell stack, plating kit), power bus, cooling loop
  * Control core: controller board (logic chips, IO shield), sensor suite
  * Mobility rig: armature (servo pair, utility claws), locomotion kit, balance module
* **Research** unlocks the node for buying, assembling, and automation. Costs rise for deeper nodes.
* **Purchasing** any unlocked node is allowed, but prices are premium so buying and selling immediately loses money.
* **Assembly** requires all child parts in the listed quantities and increases the parent inventory by one.
* **Selling** may be manual (sell one) or automated via the sell-down rule.
* **Automation cycle** (prototype): purchases up to the configured rate per node if funds allow, then sells down to
  the threshold.

## Running locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## Linting

```bash
npm run lint
```

## Building for production

```bash
npm run build
```

Outputs are emitted to `dist/`.

## Deploying on Render (static site)

The repo includes a `render.yaml` configured for a static-site deployment:

1. Create a new **Static Site** on Render and connect this repository.
2. Use build command: `npm install && npm run build`.
3. Set publish directory to `dist`.
4. Save. Render will install dependencies, build the Vite bundle, and serve it globally.

If you prefer manual setup without `render.yaml`, configure the same build command and publish path in the Render UI.
