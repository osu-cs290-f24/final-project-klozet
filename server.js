const express = require('express');
const app = express();
const port = 3000;

// Serve static files (index.html, style.css, script.js)
app.use(express.static('public'));

app.get('/data', (req, res) => {
  const data = [{ id: 1, title: 'Post 1', content: 'Content of post 1' }];
  res.json(data);  // Sends JSON data to the client
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
