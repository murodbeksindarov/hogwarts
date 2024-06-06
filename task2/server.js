import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api', async (req, res) => {
    const url = req.query.url;
    console.log('Fetching URL:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return res.status(response.status).send(response.statusText);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.patch('/api', async (req, res) => {
    const url = req.query.url;
    console.log('Patching URL:', url);
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) {
            console.error('Error updating data:', response.statusText);
            return res.status(response.status).send(response.statusText);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
