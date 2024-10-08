const dbName = 'UserDataDB';
const dbVersion = 1;
let db;

// IndexedDB initialization function
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const objectStore = db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: false });
            objectStore.createIndex('companyName', 'companyName', { unique: false });
            objectStore.createIndex('numEmployees', 'numEmployees', { unique: false });
            objectStore.createIndex('industry', 'industry', { unique: false });
            objectStore.createIndex('employeesConsideringLeaving', 'employeesConsideringLeaving', { unique: false });
            objectStore.createIndex('employeesLeavingDueToWorkLifeBalance', 'employeesLeavingDueToWorkLifeBalance', { unique: false });
            objectStore.createIndex('estimatedTurnoverCost', 'estimatedTurnoverCost', { unique: false });
        };
    });
}

// Function to save data to IndexedDB
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

// Function to get data from IndexedDB
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

// Function to calculate turnover
function calculateTurnover(numEmployees, industry) {
    const industry_data = {
        "Manufacturing": {"turnover_rate": 0.1612, "turnover_cost": 32635},
        "Healthcare": {"turnover_rate": 0.3040, "turnover_cost": 51016},
        "Luxury Retail": {"turnover_rate": 0.5080, "turnover_cost": 20113},
        "Hospitality": {"turnover_rate": 0.3000, "turnover_cost": 22761},
        "Other": {"turnover_rate": 0.3400, "turnover_cost": 30614}
    };

    const data = industry_data[industry];

    const employeesConsideringLeaving = Math.round(numEmployees * data.turnover_rate);
    const employeesLeavingDueToWorkLifeBalance = Math.round(employeesConsideringLeaving / 3);
    const estimatedTurnoverCost = employeesLeavingDueToWorkLifeBalance * data.turnover_cost;

    return {
        employeesConsideringLeaving,
        employeesLeavingDueToWorkLifeBalance,
        estimatedTurnoverCost
    };
}

// Function to process data: store, calculate, and log results
function processAndStoreData(data) {
    return initDB()
        .then(() => saveData(data))
        .then(() => {
            console.log('Data saved successfully.');

            // Perform calculations
            const turnoverData = calculateTurnover(data.numEmployees, data.industry);

            // Store calculated results
            const resultData = {
                ...data,
                employeesConsideringLeaving: turnoverData.employeesConsideringLeaving,
                employeesLeavingDueToWorkLifeBalance: turnoverData.employeesLeavingDueToWorkLifeBalance,
                estimatedTurnoverCost: turnoverData.estimatedTurnoverCost
            };
            return saveData(resultData);
        })
        .then(() => {
            console.log('Calculation results saved successfully.');
        })
        .catch((error) => {
            console.error('Error processing data:', error);
        });
}

// Function to retrieve all data from IndexedDB
function getAllData() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['userData'], 'readonly');
        const objectStore = transaction.objectStore('userData');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Function to convert data to CSV
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header], replacer));
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

function replacer(key, value) {
    return value === null ? '' : value;
}

// Function to create a downloadable file
function downloadCSV(data) {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'userData.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to download user data
async function downloadUserData() {
    try {
        const data = await getAllData();
        downloadCSV(data);
    } catch (error) {
        console.error('Error downloading user data:', error);
    }
}

// Add an event listener to the "Download Now" button to trigger the download
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadUserData);
    }
});

export { processAndStoreData, getData };
