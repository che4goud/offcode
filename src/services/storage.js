import { openDB } from 'idb';

const dbPromise = openDB('offline-leetcode', 1, {
    upgrade(db) {
        db.createObjectStore('submissions');
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
