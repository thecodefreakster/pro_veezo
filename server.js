const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios'); // Ensure you have axios imported

const app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud Storage setup
// const storage = new Storage();
const storage = new Storage({
  credentials: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
});
const bucketName = 'veezopro_videos'; // GCS bucket name

app.use(express.json({ limit: '100mb' }));
app.use(express.bodyParser({limit: '100mb'}));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const corsOptions = {
  origin: '*', // Adjust this to your front-end URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// const corsOptions = {
//   origin: corsConfig[0].origin,
//   methods: corsConfig[0].method,
//   allowedHeaders: corsConfig[0].responseHeader,
//   maxAge: corsConfig[0].maxAgeSeconds
// };

// // Use CORS middleware
// app.use(cors(corsOptions));

// Multer setup
// const upload = multer({
//   storage: multer.memoryStorage(), // Keep files in memory temporarily
// });

// Helper to generate random IDs
function generateRandomId() {
  return crypto.randomBytes(3).toString('hex');
}

// Upload endpoint
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
//       console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
//       res.redirect(`https://www.veezo.pro/v_?id=${videoId}`); // Redirect to v_id route
//     });

//     blobStream.end(req.file.buffer);
//   } catch (error) {
//     next(error);
//   }
// });

app.post('/api/get-signed-url', async (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
      return res.status(400).send({ error: 'File name is required.' });
  }

  const file = storage.bucket(bucketName).file(fileName);
  const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream'
  };

  try {
      const [url] = await file.getSignedUrl(options);
      res.status(200).send({ url });
  } catch (error) {
      console.error('Error generating signed URL:', error.message);
      res.status(500).send({ error: 'Could not generate signed URL.' });
  }
});


// app.post('/api/get-signed-url', async (req, res) => {
//   const { fileName } = req.body;
//   if (!fileName) {
//       return res.status(400).json({ error: 'File name is required' });
//   }

//   const file = storage.bucket(bucketName).file(fileName);
//   const expiresIn = 60 * 60; // URL valid for 1 hour

//   try {
//       const [url] = await file.getSignedUrl({
//           action: 'write',
//           expires: Date.now() + expiresIn * 1000,
//           contentType: 'video/*' // Adjust as per requirements
//       });
//       res.status(200).json({ url });
//   } catch (error) {
//       console.error('Error generating signed URL:', error);
//       res.status(500).json({ error: 'Failed to generate signed URL' });
//   }
// });

// Handle the upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No files uploaded' });
  }

  const filename = req.file.originalname; // Use the original file name
  const blob = storage.bucket(bucketName).file(filename);

  const blobStream = blob.createWriteStream({
      resumable: false, // Set to false for single upload
      contentType: req.file.mimetype, // Set content type
  });

  blobStream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload file' });
  });

  blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      res.status(200).json({ id: filename, url: publicUrl }); // Return the file URL
  });

  blobStream.end(req.file.buffer); // End the stream with the file buffer
});

app.post('/api/get-signed-url', async (req, res) => {
  const { fileName } = req.body;
  const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream', // Change this if needed
  };

  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
  res.json({ url });
});

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