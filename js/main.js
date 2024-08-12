// Function to validate and navigate to the next page
function validateAndNavigate(page) {
    const username = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const validUsername = 'OurTimeHQAdmin'; // Replace with actual stored username
    const validEmail = 'onlyyoucandownload@ourtimehq.com'; // Replace with actual stored email

    if (username === validUsername && email === validEmail) {
        document.getElementById('downloadButton').style.display = 'block';
    } else {
        window.location.href = page;
    }
}


// Function to validate credentials for download
function validateForDownload() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('download-email').value.trim();

    // Predefined credentials
    const validUsername = 'OurTimeHQAdmin';
    const validEmail = 'onlyyoucandownload@ourtimehq.com';

    if (username === validUsername && email === validEmail) {
        document.getElementById('downloadButton').style.display = 'block';
    } else {
        alert('Invalid username or email address.');
    }
}

// Function to get all data from IndexedDB
async function getAllData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('yourDatabaseName', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['userData'], 'readonly');
            const objectStore = transaction.objectStore('userData');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };

            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Function to convert data to CSV format
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header], replacer));
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

// Replacer function for JSON.stringify
function replacer(key, value) {
    return value === null ? '' : value;
}

// Function to create and download a CSV file
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

// Add event listener to the "Download Now" button to trigger the download
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadUserData);
    }
});
