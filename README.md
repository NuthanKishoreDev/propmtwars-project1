# 🧊 FridgeHero: The Universal Nutrition Bridge

FridgeHero is a Gemini-powered web application that takes a messy, unstructured photo of a refrigerator and converts it into a structured inventory, a waste-reduction recipe, and a smart shopping list.

## 🚀 The Problem
Household food waste is a major sustainability issue. Users often:
- Forget what's in their fridge (mental load).
- Let fresh produce wilt because they lack quick recipe ideas.
- Buy duplicate items because they don't have a structured shopping list.

## 💡 The Solution
**FridgeHero** bridges the gap between unstructured visual data and actionable nutrition logic:
1. **Intelligent Identification**: Uses Gemini Vision to detect items across various containers and states.
2. **Shelf Life Estimation**: Predicts status (e.g., "Use Soon") to prioritize ingredients.
3. **Zero-Waste Recipes**: Suggests <15 min recipes using *only* available ingredients.
4. **Smart Shopping Bridge**: Identifies missing staples to streamline the next store visit.

---

## 🛠 Technical Implementation (Problem & Solution)

### 1. Build Version Incompatibility
- **Problem**: The initial Cloud Build failed because Vite 8 requires Node.js 20+, but the build environment was using Node 18.
- **Solution**: Updated the `Dockerfile` to use `node:20-alpine` for the build stage.

### 2. Cloud Run Port Connectivity
- **Problem**: Cloud Run expects the container to listen on a dynamic `$PORT`, but standard Nginx defaults to port 80, causing deployment timeout/failure.
- **Solution**: Implemented a custom `nginx.conf` using Nginx's template system (`/etc/nginx/templates/default.conf.template`) to automatically inject the dynamic `$PORT` into the configuration at startup.

### 3. Gemini Model Availability
- **Problem**: Experimental models like `gemini-3.0-pro` might not be available in all regions/accounts.
- **Solution**: Configured the application to use `gemini-2.0-flash` by default, but allowed easy model switching via `src/lib/gemini.js` to support the latest flash-preview models.

---

## 📦 How to Run

### Local Development
1. Create a `.env` file with `VITE_GEMINI_API_KEY`.
2. Run `npm install`.
3. Run `npm run dev`.

### Cloud Deployment
1. Use the provided `Dockerfile` and `cloudbuild.yaml`.
2. Deploy via gcloud:
```bash
gcloud builds submit --config cloudbuild.yaml --substitutions=_VITE_GEMINI_API_KEY=YOUR_KEY
gcloud run deploy fridgehero --image gcr.io/YOUR_PROJECT/fridgehero --region us-central1 --allow-unauthenticated
```
