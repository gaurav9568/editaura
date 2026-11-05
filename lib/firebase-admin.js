import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with cert:", e.message);
    }
  }

  // Fallback for build time or environments without full service account credentials
  try {
    return initializeApp({
      projectId: projectId || "editaura-34e58",
    });
  } catch (e) {
    console.warn("Failed to initialize Firebase Admin with fallback:", e.message);
    return null;
  }
}

// Lazy Proxies so importing `db` or `adminAuth` never throws at module evaluation time
export const db = new Proxy(
  {},
  {
    get(target, prop) {
      const app = getAdminApp();
      if (!app) return undefined;
      const firestore = getFirestore(app);
      const value = firestore[prop];
      return typeof value === "function" ? value.bind(firestore) : value;
    },
  }
);

export const adminAuth = new Proxy(
  {},
  {
    get(target, prop) {
      const app = getAdminApp();
      if (!app) return undefined;
      const auth = getAuth(app);
      const value = auth[prop];
      return typeof value === "function" ? value.bind(auth) : value;
    },
  }
);
