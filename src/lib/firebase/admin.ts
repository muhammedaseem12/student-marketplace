import * as admin from 'firebase-admin';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

let serviceAccount: any = null;

const serviceAccountPath = path.join(process.cwd(), 'src', 'lib', 'firebase', 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  } catch (e) {
    console.error('Error reading serviceAccountKey.json', e);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY environment variable', e);
  }
}

let firebaseApp: App | null = getApps()[0] ?? null;

if (!firebaseApp && serviceAccount && serviceAccount.private_key && !serviceAccount.private_key.includes('YOUR_PRIVATE_KEY')) {
  try {
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || 'student-marketplace-badb0',
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export default admin;
