# Deployment Guide: Vercel (Frontend) & Render (Backend)

Follow these steps to deploy the application successfully in production.

---

## 1. Backend Deployment on Render

### Step-by-Step Setup
1. Log in or sign up at [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository: `Gowthamarajan01/Blockchain-Skill-Crediential-System`.
4. Configure the service settings:
   - **Name:** Choose a name (e.g. `blockchain-credential-api`).
   - **Environment:** `Node`
   - **Root Directory:** `backend` (This is critical: it tells Render to run everything inside the backend folder).
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Advanced** to add **Environment Variables**:
   - `PORT`: `5000` (or leave empty, Render will allocate it automatically)
   - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
   - `JWT_SECRET`: A secure random key (e.g., `yoursecretkey123!`)
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.
7. Once deployed, note down your backend's live URL (e.g., `https://blockchain-credential-api.onrender.com`). You will need this URL for the frontend.

> [!WARNING]
> **Free Instance Spin-up:** Render's free tier services spin down after 15 minutes of inactivity. When someone first visits your application, it might take 50+ seconds for the backend to start up and allow logging in. This is normal behavior for Render's free plan.

---

## 2. Frontend Deployment on Vercel

### Step-by-Step Setup
1. Log in or sign up at [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository: `Gowthamarajan01/Blockchain-Skill-Crediential-System`.
4. Configure the build settings:
   - **Framework Preset:** Select **Vite**.
   - **Root Directory:** Edit and select **`frontend`** (This tells Vercel to build the Vite app).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Open the **Environment Variables** section and add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your Render backend URL (e.g., `https://blockchain-credential-api.onrender.com` without a trailing slash).
6. Click **Deploy**.
7. Vercel will build the frontend and provide your deployment URL. Navigate to it, and your frontend will be fully functional, reading/writing from your Render database!

---

## 3. Persistent Storage (Optional Recommendation)
Currently, certificate documents are uploaded to Render's local `backend/uploads` directory. Render has ephemeral storage, which means uploaded certificates are deleted when Render restarts the service.
- If you notice certificates failing to view or download after a few hours, this is why.
- To make certificates fully persistent, you can configure cloud storage (e.g., Cloudinary or Amazon S3) in `backend/middleware/multer.js` or `backend/controllers/credentialController.js`.
