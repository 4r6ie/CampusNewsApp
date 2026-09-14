// Firebase Admin configuration.
// Populate FCM_* environment variables before enabling push notifications.
import admin from 'firebase-admin';

interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

const firebaseConfig: FirebaseConfig = {
  projectId: process.env.FCM_PROJECT_ID || '',
  clientEmail: process.env.FCM_CLIENT_EMAIL || '',
  privateKey: process.env.FCM_PRIVATE_KEY || '',
};

let firebaseApp: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  const hasCredentials =
    firebaseConfig.projectId &&
    firebaseConfig.clientEmail &&
    firebaseConfig.privateKey;

  if (!hasCredentials) {
    throw new Error('Firebase credentials are not configured');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.projectId,
      clientEmail: firebaseConfig.clientEmail,
      privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
    }),
  });

  return firebaseApp;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.projectId &&
      firebaseConfig.clientEmail &&
      firebaseConfig.privateKey,
  );
}