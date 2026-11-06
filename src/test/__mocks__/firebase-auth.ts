// Mock firebase/auth for Vitest Node environment
export const getAuth = () => ({});
export const onAuthStateChanged = () => () => {};
export const signInWithEmailAndPassword = () => Promise.resolve({});
export const signOut = () => Promise.resolve();
export const createUserWithEmailAndPassword = () => Promise.resolve({});
export const sendPasswordResetEmail = () => Promise.resolve();
