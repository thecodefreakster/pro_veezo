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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const corsOptions = {
  origin: corsConfig[0].origin,
  methods: corsConfig[0].method,
  allowedHeaders: corsConfig[0].responseHeader,
  maxAge: corsConfig[0].maxAgeSeconds
};

// Use CORS middleware
app.use(cors(corsOptions));

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(), // Keep files in memory temporarily
});

// Helper to generate random IDs
function generateRandomId() {
  return crypto.randomBytes(3).toString('hex');
}

app.get('/api/gsu', async (req, res) => {
  const { fileName } = req.query; // Get the file name from the query

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream', // Adjust based on your requirements
  };

  try {
      const [url] = await file.getSignedUrl(options);
      res.status(200).send({ url });
  } catch (error) {
      console.error('Error generating signed URL:', error);
      res.status(500).send({ error: 'Could not generate signed URL' });
  }
});

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

// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   const { chunkIndex, totalChunks } = req.body;
//   const fileBuffer = req.file.buffer; // Access the file buffer

//   Validate chunk size to prevent exceeding limits
//   const maxChunkSize = 4.5 * 1024 * 1024; // 4.5 MB
//   if (fileBuffer.length > maxChunkSize) {
//       return res.status(413).send({ error: 'Chunk exceeds the maximum size of 4.5 MB' });
//   }

//   Define the name for the chunk based on the original file name and index
//   const chunkFileName = `${req.file.originalname}.part${chunkIndex}`;

//   try {
//       Upload chunk to Google Cloud Storage
//       await storage.bucket(bucketName).file(chunkFileName).save(fileBuffer, {
//           metadata: {
//               contentType: req.file.mimetype,
//           },
//       });

//       console.log(`Received chunk ${parseInt(chunkIndex) + 1} of ${totalChunks}`);

//       Check if all chunks are received
//       if (parseInt(chunkIndex) === totalChunks - 1) {
//           console.log('All chunks received');
//           Handle logic to merge chunks if necessary
//       }

//       res.status(200).send({ message: `Chunk ${parseInt(chunkIndex) + 1} uploaded successfully` });
//   } catch (error) {
//       console.error('Error uploading chunk:', error);
//       res.status(500).send({ error: 'Failed to upload chunk' });
//   }
// });

app.get('/v_', (req, res) => {
  const fileId = req.query.id;
  if (!fileId) return res.status(400).send('File ID is required.');

  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}`;
  res.redirect(gcsUrl);
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
