// Mock firebase/database for Vitest Node environment
export const getDatabase = () => ({});
export const ref = () => ({});
export const get = () => Promise.resolve({ exists: () => false, val: () => null });
export const set = () => Promise.resolve();
export const update = () => Promise.resolve();
export const onValue = () => () => {};
export const off = () => {};
export const push = () => ({ key: 'mock-key' });
export const remove = () => Promise.resolve();
export const child = () => ({});
export const runTransaction = () => Promise.resolve({ committed: false, snapshot: { exists: () => false, val: () => null } });
export const serverTimestamp = () => null;
