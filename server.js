const express = require('express');
const app = express();
const port = 3000;

const outfitData = require("./public/outfits.json")
const closetData = require("./public/closet.json")

// Serve static files (index.html, style.css, script.js)
app.use(express.static('public'));

// Endpoint to send outfit data
app.get('/outfits', (req, res) => {
  res.json(outfitData);
});

// Endpoint to send closet data
app.get('/closet', (req, res) => {
  res.json(closetData);
});

app.get('/outfits/:id', (req, res) => {
  const outfitId = req.params.id;
  const outfit = outfitData.find(o => o.id == outfitId);
  
  if (!outfit) {
    return res.status(404).send('Outfit not found');
  }
  res.json(outfit);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
