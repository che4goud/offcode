import { openDB } from 'idb';

const dbPromise = openDB('offline-leetcode', 2, {
    upgrade(db, oldVersion) {
        if (oldVersion < 1) db.createObjectStore('submissions');
        if (oldVersion < 2) db.createObjectStore('solved');
    },
});

export async function saveCode(problemId, language, code) {
    const db = await dbPromise;
    await db.put('submissions', code, `${problemId}-${language}`);
}

export async function getCode(problemId, language) {
    const db = await dbPromise;
    return db.get('submissions', `${problemId}-${language}`);
}

export async function markSolved(problemId) {
    const db = await dbPromise;
    await db.put('solved', true, problemId);
}

export async function getAllSolved() {
    const db = await dbPromise;
    const keys = await db.getAllKeys('solved');
    return new Set(keys);
}
