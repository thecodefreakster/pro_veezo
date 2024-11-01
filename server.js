// const express = require('express');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const crypto = require('crypto');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Google Cloud Storage setup
// const storage = new Storage();
// const bucketName = 'veezopro_videos'; // GCS bucket name

// // Multer setup
// const upload = multer({
//   storage: multer.memoryStorage(), // Keep files in memory temporarily
// });

// // Helper to generate random IDs
// function generateRandomId() {
//   return crypto.randomBytes(3).toString('hex');
// }

// // Upload endpoint
// app.post('/api/upload', upload.single('file'), async (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No files uploaded' });
//   }

//   try {
//     const videoId = generateRandomId();
//     const fileExtension = path.extname(req.file.originalname);
//     const filename = `${videoId}${fileExtension}`;
//     const blob = storage.bucket(bucketName).file(filename);
//     console.log('Uploading');

//     const blobStream = blob.createWriteStream({
//       resumable: false,
//       contentType: req.file.mimetype,
//     });

//     blobStream.on('error', (err) => next(err));

//     blobStream.on('finish', () => {
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
//       res.status(200).json({ id: videoId, url: publicUrl });
//     });

//     blobStream.end(req.file.buffer);
//   } catch (error) {
//     next(error);
//   }
// });

// app.get('/v', async (req, res) => {
//   const videoId = req.query.id;
//   console.log('1Received GET request for video ID:', videoId);
//   if (!videoId) {
//     return res.status(400).send('Video ID is required.');
//   }

//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`;
//   try {
//     console.log('Get--');
//     const response = await axios.get(gcsUrl, { responseType: 'stream' });
//     res.setHeader('Content-Type', 'video/quicktime');
//     response.data.pipe(res);
//   } catch (error) {
//     console.error('Error fetching video:', error.message);
//     res.status(404).send('Video not found.');
//   }
// });

// app.get(`/api/${id}`, async (req, res) => {
//   const videoId = req.query.id;
//   console.log('2Received GET request for video ID:', videoId);
//   if (!videoId) {
//     return res.status(400).send('Video ID is required.');
//   }

//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`;
//   try {
//     console.log('Get2--');
//     const response = await axios.get(gcsUrl, { responseType: 'stream' });
//     res.setHeader('Content-Type', 'video/quicktime');
//     response.data.pipe(res);
//   } catch (error) {
//     console.error('Error fetching video:', error.message);
//     res.status(404).send('Video not found.');
//   }
// });


// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).send("Page not found");
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('An error occurred on the server');
// });

// app.listen(PORT, () => {
//   console.log(`The server is running on port ${PORT}`);
// });

const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios'); // Make sure to import axios

const app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud Storage setup
const storage = new Storage();
const bucketName = 'veezopro_videos'; // GCS bucket name

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(), // Keep files in memory temporarily
});

// Helper to generate random IDs
function generateRandomId() {
  return crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex string
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const videoId = generateRandomId();
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${videoId}${fileExtension}`;
    const blob = storage.bucket(bucketName).file(filename);
    console.log('Uploading');

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on('error', (err) => next(err));

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      // Redirect to the video URL with the generated ID
      res.redirect(`https://veezo.pro/v?id=${videoId}`);
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

// Video retrieval endpoint
app.get('/v', async (req, res) => {
  const videoId = req.query.id;
  console.log('Received GET request for video ID:', videoId);
  if (!videoId) {
    return res.status(400).send('Video ID is required.');
  }

  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`; // Adjust if necessary based on file extension
  try {
    console.log('Fetching video from GCS...');
    const response = await axios.get(gcsUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'video/quicktime'); // Adjust if necessary
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(404).send('Video not found.');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('An error occurred on the server');
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

