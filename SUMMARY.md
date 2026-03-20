🧊 **FridgeHero: The Universal Nutrition Bridge**

**The Problem**: 
Household food waste is a major sustainability issue. Users suffer from "refrigerator black-hole" syndrome: forgetting items, letting produce wilt due to a lack of quick ideas, and over-buying staples.

**The Solution**: 
FridgeHero bridges messy visual data and actionable nutrition logic using Gemini 2.0 Flash:
- **Vision**: Identifies ingredients in any container.
- **Waste Reduction**: Predicts shelf-life & prioritizes "Use Soon" items.
- **Reasoning**: Generates <15 min recipes using only available items.
- **Action**: Flags missing staples to automate a smart shopping list.

**Technical Hurdles & Fixes**:
- **Build**: Fixed Cloud Build failures by upgrading Dockerfile to node:20-alpine.
- **Port Mapping**: Resolved Cloud Run timeouts by using an Nginx template for dynamic $PORT injection.

**Tech Stack**:
- **Core**: React, Vite, Framer Motion, Lucide.
- **AI**: Gemini 2.0 Flash.
- **Platform**: Google Cloud Build, Google Cloud Run.
