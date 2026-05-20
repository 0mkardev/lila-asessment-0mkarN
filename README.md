# Lila Black - Player Journey Visualization Tool

[Live Deployment URL: https://example-deployment-url.com]

## Overview
The Player Journey Visualization Tool is a robust, web-based analytics dashboard designed specifically for Level Designers and Data Analysts at LILA Games. It processes raw telemetry data directly in the browser and renders massive datasets of player movements, kills, and deaths onto 2D minimaps. This enables the design team to visually analyze player flow, identify problematic chokepoints, and make data-driven decisions to improve match pacing and map balance.

## Tech Stack
* **React (Vite):** Fast, modern frontend framework for building the dashboard UI.
* **Tailwind CSS (v4):** Utility-first styling to create a clean, professional, dark-mode dashboard aesthetic.
* **Zustand:** Lightweight and extremely fast global state management for handling filters, playback timeline, and currently selected match data.
* **React-Three-Fiber (R3F) & Drei:** WebGL-powered 3D rendering engine utilized to render thousands of data points, lines, and geometries simultaneously at 60fps without causing DOM performance bottlenecks.
* **Hyparquet:** A pure-JavaScript, client-side WebAssembly alternative for reading and parsing Apache Parquet telemetry files directly in the browser. This eliminates the need for any backend server infrastructure.

## Setup Instructions

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Local Installation
To run the tool locally, execute the following commands in your terminal:

```bash
# 1. Clone the repository (if applicable)
# git clone <repository-url>
# cd Adilac

# 2. Install all required dependencies
npm install

# 3. Start the local development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`. 
*(Note: No environment variables are required to run this project natively as the data is served from the local `public` folder.)*

## Feature Walkthrough

* **Match Selection:** Use the Sidebar to filter matches by Date, and then pick a specific match. The dropdown displays metadata including the number of human players, bots, and storm deaths in each match.
* **2D Minimap Visualization:** Left-click and drag to pan around the map using Google-Maps style controls. Use the scroll wheel to smoothly zoom in and out of the high-resolution map plane.
* **Playback Timeline:** Press Play on the bottom timeline to watch the match unfold chronologically, or drag the slider to instantly jump to a specific timestamp in the match.
* **Dynamic Filters:**
  * **Human vs Bot Paths:** Toggle visibility. Humans are represented by thick blue lines and white endpoint markers; bots use solid red lines and orange markers. Green dots denote the start of the path.
  * **Event Markers:** Toggle Kills (Red Circles), Deaths (White Circles), Loot (Gold Cones), and Storm Deaths (Purple Cones).
* **Heatmap Overlays:** Switch from standard Path visualization to dynamic Heatmaps.
  * **Traffic Heatmap:** Highlights heavily traversed paths and bot patrols using a vibrant glowing gold overlay.
  * **Killzone Heatmap:** Exposes the most lethal combat zones and meat-grinders using a high-opacity red overlay.
