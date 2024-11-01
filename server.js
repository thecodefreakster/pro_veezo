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


// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   const { chunkIndex, totalChunks } = req.body;

//   if (!req.file) {
//     return res.status(400).json({ error: 'No files uploaded' });
//   }

//   const videoId = generateRandomId();
//   const fileExtension = path.extname(req.file.originalname);
//   const chunkFileName = `${videoId}_chunk_${chunkIndex}${fileExtension}`;

//   try {
//     // Get a signed URL for the chunk
//     const url = await GetSignedUrl(chunkFileName);

//     // Upload the chunk
//     const response = await axios.put(url, req.file.buffer, {
//       headers: {
//         'Content-Type': req.file.mimetype,
//       },
//     });

//     if (response.status !== 200) {
//       return res.status(500).json({ error: 'Failed to upload chunk' });
//     }

//     console.log(`Chunk ${chunkIndex} uploaded successfully.`);

//     // Check if all chunks are uploaded
//     if (parseInt(chunkIndex) === totalChunks - 1) {
//       console.log('All chunks uploaded successfully.');
//       // Logic to handle completion (e.g., combining files, notifying user)
//     }

//     res.status(200).send({ message: `Chunk ${chunkIndex} uploaded successfully` });
//   } catch (error) {
//     console.error('Error uploading chunk:', error);
//     res.status(500).send({ error: 'Failed to upload chunk' });
//   }
// });



const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
      fileSize: 100 * 1024 * 1024, // Limit size to 100MB (adjust as needed)
  },
});

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
