🧊 **FridgeHero: The Universal Nutrition Bridge**

**The Problem**: 
Household food waste is a major sustainability issue. Users suffer from "refrigerator black-hole" syndrome: forgetting items, letting produce wilt due to a lack of quick ideas, and over-buying staples.

**The Solution**: 
FridgeHero bridges messy visual data and actionable nutrition logic using Gemini 1.5 Flash:
- **Vision**: Identifies ingredients in any container, from open jars to meal prep bins.
- **Waste Reduction**: Predicts shelf-life & prioritizes "Use Soon" items with logic-driven status indicators.
- **Reasoning**: Generates <15 min recipes using only available items; handles "Empty Fridge" zero-states gracefully.
- **Action**: Flags missing staples to automate a smart shopping list.

**Technical Hurdles & Fixes**:
- **Build**: Upgraded Dockerfile to node:20-alpine for faster, stable Cloud Build.
- **Port Mapping**: Resolved Cloud Run timeouts via dynamic $PORT injection in Nginx.
- **Verification**: Integrated Vitest for unit testing core utility logic.
- **A11y**: Implementation of ARIA roles and skip-links for universal accessibility.

**Tech Stack**:
- **Core**: React, Vite, Framer Motion, Lucide.
- **AI**: Gemini 1.5 Flash.
- **Platform**: Google Cloud Build, Google Cloud Run.
