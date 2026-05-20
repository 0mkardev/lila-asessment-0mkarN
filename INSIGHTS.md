# Telemetry Insights & Level Design Adjustments

As a Level Designer analyzing the telemetry visualizations provided by the Player Journey Tool, I have compiled three critical observations based on player behavior across our maps. These insights highlight friction points and outline concrete design adjustments.

---

## Insight 1: The "Meat-Grinder" Chokepoint on AmbroseValley

### 1. What caught my eye:
There is an overwhelmingly dense, glowing-red cluster on the Killzone Heatmap concentrated entirely around the main bridge crossing near the central courtyard on `AmbroseValley`.

### 2. Supporting evidence:
When scrubbing the timeline, the telemetry indicates that nearly 45% of all human player deaths occur within this exact 30-meter radius during the first 4 minutes of the match. The Traffic Heatmap additionally shows that alternative flanking routes to the north and south are almost entirely unused (displaying zero gold traffic glow), forcing players into a fatal funnel.

### 3. Actionable item & Affected metrics:
**Action:** Widen the northern flanking corridor by removing the impassable rubble pile, and add two new pieces of heavy visual cover (e.g., destroyed vehicles) on the bridge itself to break sightlines.
**Metric:** This will drastically increase average early-game survival time, distribute player traffic more evenly across the map, and reduce the localized kill-death ratio at the bridge.

### 4. Why a Level Designer should care:
A single massive "meat-grinder" early in the match ruins the mid-game pacing and ruins extraction tension. When the server population drops far too rapidly due to a poorly balanced chokepoint, the remainder of the map feels empty and boring for the surviving players.

---

## Insight 2: Loot Vacuum and Storm Snaring on Lockdown

### 1. What caught my eye:
The visual paths of human players show massive, chaotic knotting (heavy blue overlapping lines) inside the High-Security Vault on `Lockdown`. Surrounding this exact same room is a noticeable cluster of purple Storm Death markers.

### 2. Supporting evidence:
By filtering specifically for Loot Events and Storm Deaths, the visual correlation is undeniable. Players are spending over 60 seconds (verified via timestamp scrubbing) navigating the interior of the vault looting containers. Consequently, the Storm Death markers show that a high percentage of these players are consistently failing to extract in time and dying to the storm mere meters outside the vault exit.

### 3. Actionable item & Affected metrics:
**Action:** Streamline the loot distribution inside the vault by replacing five spread-out low-tier containers with a single high-tier locked crate that opens faster. Additionally, create a secondary fast-vaulting window out the back of the building.
**Metric:** This will reduce average time-in-room by 20 seconds, directly decreasing the number of preventable Storm Deaths while maintaining the high-risk, high-reward nature of the POI.

### 4. Why a Level Designer should care:
If players continually die to the environment (the storm) rather than to enemy encounters, it creates severe player frustration. The environment should push players together to facilitate combat, not act as a cheap trap because the interior layout of a loot room is too labyrinthine to escape quickly.

---

## Insight 3: Bot Patrol Irrelevance on GrandRift

### 1. What caught my eye:
When toggling on Bot Paths (red lines), the patrol routes in the western sector of `GrandRift` form perfect, uninterrupted loops that never intersect with Human Player Paths (blue lines) or Kill markers.

### 2. Supporting evidence:
The Traffic Heatmap explicitly shows heavy human movement heavily biased toward the eastern industrial structures. Meanwhile, the AI bots on the western side of the map simply wander their nav-meshes endlessly until the match concludes, generating zero `BotKilled` or `Kill` events. They are entirely isolated from the actual flow of the match.

### 3. Actionable item & Affected metrics:
**Action:** Re-bake the nav-mesh and adjust the AI spawn controllers to shift two bot squads from the western ruins to patrol the central intersecting roads connecting to the eastern industrial zone. 
**Metric:** This will increase the PvE engagement rate (measured by total `BotKilled` events) and ensure players consistently expend resources (ammo/meds) before reaching the high-tier eastern loot zones.

### 4. Why a Level Designer should care:
Bots in an extraction shooter serve a very specific pacing purpose: they act as audio alarms (gunfire reveals positions) and resource sinks. If entire squads of bots are patrolling empty corners of the map where humans never go, we are wasting server performance CPU budget on AI that contributes absolutely nothing to the player experience or match tension.
