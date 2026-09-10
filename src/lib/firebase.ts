import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || undefined
    );
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

// Test Firestore connection on boot with resilient error catching
(async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
  } catch (error: any) {
    if (
      error?.code === 'unavailable' ||
      error?.name === 'FirebaseError' ||
      (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable')))
    ) {
      // Gracefully handle initial offline/handshake state without crashing
      console.info('Firestore operating with resilient caching while connection establishes.');
    }
  }
})();

export { app };
export default db;
