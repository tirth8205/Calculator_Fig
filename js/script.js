function navigateToPage(page) {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);

    // Load stored data
    getData((data) => {
        if (data.length > 0) {
            const latestData = data[data.length - 1];
            if (document.getElementById('name')) {
                document.getElementById('name').value = latestData.name || '';
            }
            if (document.getElementById('email')) {
                document.getElementById('email').value = latestData.email || '';
            }
            if (document.getElementById('companyName')) {
                document.getElementById('companyName').value = latestData.companyName || '';
            }
            if (document.getElementById('numEmployees')) {
                document.getElementById('numEmployees').value = latestData.numEmployees || '';
            }
            if (document.getElementById('industry')) {
                document.getElementById('industry').value = latestData.industry || '';
            }
        }
    });
});
