const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Serve the index.html and related files from current directory
app.use(express.static(path.join(__dirname)));

// Enable CORS for the proxy route
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/proxy', async (req, res) => {
  const { tags, limit } = req.query;
  if (!tags) return res.status(400).send('Missing "tags" parameter.');
  const safeLimit = parseInt(limit, 10) || 10;
  const apiUrl = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=${safeLimit}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).send(`Error from R34: ${response.statusText}`);
    }
    const xml = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error fetching from R34:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
