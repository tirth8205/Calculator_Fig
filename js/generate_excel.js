import { getAllData } from 'indexedDB.js';
import * as XLSX from 'xlsx';

function downloadExcel() {
    getAllData().then((data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "UserData");

        XLSX.writeFile(workbook, "UserData.xlsx");
    }).catch((error) => {
        alert('Error generating Excel file: ' + error);
    });
}

document.getElementById('download-excel').addEventListener('click', downloadExcel);
