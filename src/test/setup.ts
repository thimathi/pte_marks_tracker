// Vitest setup file — mock Firebase modules for Node environment
import { vi } from 'vitest';

vi.mock('../config/firebase', () => ({
  app: {},
  auth: {},
  db: {},
  firebaseConfig: {},
}));

vi.mock('firebase/app', () => ({
  initializeApp: () => ({}),
  getApps: () => [],
  getApp: () => ({}),
}));

vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: () => {},
  signInWithEmailAndPassword: () => Promise.resolve({}),
  signOut: () => Promise.resolve(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: () => ({}),
  ref: () => ({}),
  get: () => Promise.resolve({ exists: () => false, val: () => null }),
  set: () => Promise.resolve(),
  update: () => Promise.resolve(),
  onValue: () => {},
  off: () => {},
  push: () => ({ key: 'mock-key' }),
  remove: () => Promise.resolve(),
  child: () => ({}),
  runTransaction: () => Promise.resolve({ committed: false, snapshot: { exists: () => false, val: () => null } }),
  serverTimestamp: () => null,
}));
