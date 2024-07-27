// js/indexedDB.js

const dbName = 'UserDataDB';
const dbVersion = 1;
let db;

function initDB() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: false });
        objectStore.createIndex('companyName', 'companyName', { unique: false });
        objectStore.createIndex('numEmployees', 'numEmployees', { unique: false });
        objectStore.createIndex('industry', 'industry', { unique: false });
    };
}

function saveData(data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['userData'], 'readwrite');
        const objectStore = transaction.objectStore('userData');
        const request = objectStore.add(data);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function getData(callback) {
    const transaction = db.transaction(['userData'], 'readonly');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        callback(event.target.result);
    };

    request.onerror = (event) => {
        console.error('Failed to fetch data:', event.target.error);
    };
}

// Ensure these are exported correctly
export { initDB, saveData, getData };
