function formatData(data) {
    let formattedData = '<ul>';
    for (const [key, value] of Object.entries(data.data)) {
        if (typeof value === 'object' && value !== null) {
            formattedData += `<li><strong>${key}:</strong> ${formatData(value)}</li>`;
        } else {
            formattedData += `<li><strong>${key}:</strong> ${value}</li>`;
        }
    }
    formattedData += '</ul>';
    return formattedData;
}

document.getElementById('fetch-update-btn').addEventListener('click', async () => {
    const campId = document.getElementById('camp-id').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    if (!campId) {
        resultDiv.innerHTML = 'Please enter a Camp ID.';
        return;
    }

    const proxyUrl = `http://localhost:3000/api?url=http://api.edupulse.software/api/camp/${campId}`;

    try {
        // Fetch the data
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        // Process the data
        const firstNumber = data.data.FirstNumber;
        const secondNumber = data.data.SecondNumber;
        const text = data.data.Text;

        const expectedNumber = firstNumber + secondNumber;
        const upperText = text.toUpperCase();

        
        const patchData = {
            text: upperText,
            expected_number: expectedNumber
        };

        
        const patchResponse = await fetch(proxyUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patchData)
        });

        if (!patchResponse.ok) {
            throw new Error(`Error updating data: ${patchResponse.statusText}`);
        }

        const patchResult = await patchResponse.json();
        resultDiv.innerHTML = formatData(patchResult);
    } catch (error) {
        resultDiv.innerHTML = `There was a problem: ${error.message}`;
    }
});