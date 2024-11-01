const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios'); // Ensure you have axios imported

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
  return crypto.randomBytes(3).toString('hex');
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
      console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
      res.redirect(`https://www.veezo.pro/v_?id=${videoId}`); // Redirect to v_id route
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

// v_id endpoint to serve the video
// app.get('/video/:videoId', async (req, res) => {
//   const videoId = req.params.videoId; // Capture the video ID from the URL
//   const bucketName = 'veezopro_videos'; // Your GCS bucket name
//   const videoUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`; // Construct the GCS URL

//   try {
//       // Make a request to the GCS URL to stream the video
//       const response = await axios({
//           method: 'GET',
//           url: videoUrl,
//           responseType: 'stream' // Stream the response
//       });

//       // Set the correct content type for video files
//       res.setHeader('Content-Type', 'video/quicktime'); // Use 'video/mp4' if the format is mp4
//       response.data.pipe(res); // Pipe the response data to the client
//   } catch (error) {
//       // Handle errors (e.g., video not found)
//       console.error('Error fetching video:', error.message);
//       res.status(404).send('Video not found');
//   }
// });

// Route to stream video from Google Cloud Storage
app.get('/video/:videoId', async (req, res) => {
    const videoId = req.params.videoId; // Capture the video ID from the URL
    const bucketName = 'veezopro_videos'; // Your GCS bucket name
    const videoUrl = `https://storage.googleapis.com/${bucketName}/${videoId}`; // Construct the GCS URL

    try {
        // Make a request to the GCS URL to stream the video
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream' // Stream the response
        });

        // Set the correct content type for the video file
        res.setHeader('Content-Type', 'video/quicktime'); // Use 'video/mp4' if the format is mp4
        response.data.pipe(res); // Pipe the response data to the client
    } catch (error) {
        // Handle errors (e.g., video not found)
        console.error('Error fetching video:', error.message);
        res.status(404).send('Video not found');
    }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred on the server');
});

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on port http://localhost:${PORT}`);
});
