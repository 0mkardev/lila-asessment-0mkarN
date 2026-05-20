# Technical Architecture & Rationale

## Tech Stack & Rationale
* **React-Three-Fiber (R3F):** Visualizing player journeys involves tracking thousands of distinct data points (lines, vertices, distinct event meshes). Rendering this in standard DOM/SVG leads to immense performance drops. R3F was chosen to leverage WebGL's hardware acceleration, processing batch geometry via `InstancedMesh` and Line components to comfortably render everything simultaneously at a smooth 60fps.
* **Hyparquet (Client-Side Parsing):** We needed a way to decode raw telemetry Parquet files without creating costly and complex backend infrastructure. `hyparquet` is a pure-JavaScript reader that perfectly natively parses the buffer streams directly in the browser's memory without running into WASM memory pointer limitations.
* **Zustand:** Due to the high-frequency nature of UI filters and timeline scrubbing intersecting with the WebGL canvas, we needed a state manager that prevented unnecessary re-renders. Zustand provides rapid, un-opinionated state updates perfectly suited for bridging React UI with the R3F Canvas.

## Data Flow
The data flow operates entirely securely within the client environment:
1. **Raw Telemetry Storage:** Apache Parquet (`.nakama-0`) files and an index (`index.json`) are statically hosted.
2. **Buffer Fetching:** The user selects a match. The application streams the file into an `ArrayBuffer` natively using standard HTTP fetch.
3. **Hyparquet Decoder:** The buffer is passed to `hyparquet`, which decodes the columnar data into structured JavaScript Objects representing standard events (`Position`, `Kill`, `Loot`, etc.).
4. **Zustand State Engine:** The parsed objects are committed to the global store, sorted by timestamp. The UI derives min/max values for the Timeline scrubber.
5. **R3F Consumption:** The `<Canvas>` components reactively re-evaluate based on the `currentTimestamp` and filter booleans, extracting only the relevant coordinates to build the meshes in the active WebGL frame.

## Coordinate Mapping (CRITICAL)
In order to correctly translate 3D world coordinates into our 2D WebGL Map plane, we run the following mathematical mapping function relying on the provided `scale` and `origin` values for each map:

1. **UV Normalization:** We take the raw world coordinates `(X, Z)` and normalize them into a `(0.0 to 1.0)` UV space relative to the map boundaries. 
   * `u = (X - originX) / scale`
   * `v = (Z - originZ) / scale`
2. **Pixel Space Transformation:** We map the UV coordinates to a `1024x1024` grid. Because WebGL UV mappings define `(0, 0)` at the bottom-left of the texture, but typical 2D math defines `(0, 0)` at the top-left, we explicitly invert the V axis to match standard map plotting.
   * `pixelX = u * 1024`
   * `pixelY = (1 - v) * 1024`
3. **Orientation Match:** The texture is passed to the plane maintaining the standard Three.js `flipY = true`, ensuring the top-left of the image maps perfectly to `y = 1024`, completely aligning the visual map to the mathematical coordinates.

## Assumptions Made
* **Event Classification:** In the data, bot-related events utilize distinct event strings like `BotPosition` and `BotKill`. We assumed humans strictly log as `Position` or `Kill`, classifying entities based on the logged action string rather than string-parsing user UUID formats.
* **Missing Interpolation:** The tool assumes that connecting two widely sparse `Position` events with a straight line is acceptable macro-level representation. No advanced bezier-curve pathfinding or interpolation was assumed or required.
* **Time Alignment:** Assumed all match logs start their effective timeline upon the very first logged event in the Parquet file, building the scrubber bounds from `Event[0].ts` to `Event[last].ts`.

## Major Trade-offs

| Decision | Pros | Cons | Final Conclusion |
| :--- | :--- | :--- | :--- |
| **Client-Side vs Python Backend** | Serverless deployment, near-zero hosting costs, eliminates network latency during timeline scrubbing. | Users must download the entire Parquet file into browser memory before initial visualization. | **Client-Side.** Perfect for a specialized internal tool where users have decent hardware/bandwidth and zero backend maintenance is highly preferred. |
| **WebGL (Canvas) vs SVG/DOM** | Capable of rendering 10,000+ vertices at steady 60fps; allows instant zooming and fluid animations. | Higher implementation complexity; text/HTML overlays require specialized layering or fallbacks. | **WebGL.** WebGL handles large-scale telemetry easily. DOM elements would entirely freeze the browser attempting to draw 5,000 individual `<line>` tags. |
| **Solid vs Dashed Lines** | Extremely cheap to compute in GPU; easily readable at wide zoom levels. | Makes human vs bot paths harder to distinguish if they overlap identical colors. | **Solid Lines.** Chose robust color differentiation (Blue vs Red) and unique line-weights over computing dashing, ensuring the map looks clean. |
