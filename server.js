// const express = require('express');
// const multer = require('multer');
// const axios = require('axios');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const bucketName = 'veezopro_videos';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'public', 'file'));
//   },
//   filename: function (req, file, cb) {
//     const videoId = generateRandomId();
//     const fileExtension = path.extname(file.originalname);
//     cb(null, videoId + fileExtension);
//   }
// });

// const upload = multer({ storage: storage });
// app.use(express.static('public'));

// app.post('/api/upload', upload.single('file'), (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No files uploaded' });
//   }

//   const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;
//   const fileId = req.file.filename.split('.')[0];
//   res.status(200).json({ id: fileId });
// });

// app.get('/v', (req, res) => {
//   const videoId = req.query.id;
//   res.sendFile(path.join(__dirname, 'public', 'video.html'));
// });

// app.get('/v_id=:id', (req, res) => {
//   const fileId = req.params.id; // Get the ID from the URL
//   const filePath = path.join(__dirname, 'public', 'file', `${fileId}.*`); // Match any file extension

//   // Send the file
//   res.sendFile(filePath, (err) => {
//       if (err) {
//           console.error('Error sending file:', err);
//           res.status(404).send('File not found.');
//       }
//   });
// });

// app.get('/v', async (req, res) => {
//   const fileId = req.query.id; // Get the file ID from the query parameter

//   if (!fileId) {
//     return res.status(400).send('File ID is required.');
//   }

//   Construct the GCS public URL
//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;
//   const gcsURL = `https://storage.googleapis.com/veezopro_videos/k50pok.mov`
//   console.log("googleurl--", gcsUrl);
//   try {
//     Make a request to GCS and stream the video to the client
//     const response = await axios.get(gcsUrl, { responseType: 'stream' });

//     Set the correct content type based on the GCS response
//     res.setHeader('Content-Type', response.headers['content-type']);

//     Pipe the GCS stream directly to the response
//     response.data.pipe(res);
//   } catch (error) {
//     console.error('Error fetching video:', error.message);
//     res.status(404).send('Video not found.');
//   }
// });

// app.use((req, res, next) => {
//   res.status(404).send("Page not found");
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('An error occurred on the server');
// });

// app.listen(PORT, () => {
//   console.log(`The server is running on the port ${PORT}`);
// });

// function generateRandomId() {
//     var id = "";
//     var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     var charactersLength = characters.length;
//     for (var i = 0; i < 6; i++) {
//         id += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return id;
// }

//----------------------------------------------------------------









// const express = require('express');
// const multer = require('multer');
// const axios = require('axios');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const bucketName = 'veezopro_videos';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'public', 'file'));
//   },
//   filename: function (req, file, cb) {
//     const videoId = generateRandomId();
//     const fileExtension = path.extname(file.originalname);
//     cb(null, videoId + fileExtension);
//   }
// });

// const upload = multer({ storage: storage });
// app.use(express.static('public'));

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No files uploaded' });
//   }

//   const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;
//   const fileId = req.file.filename.split('.')[0];
//   res.status(200).json({ id: fileId });
// });

// // Update this route to handle fetching video from GCS
// app.get('/v', async (req, res) => {
//   const fileId = req.query.id; // Get the file ID from the query parameter

//   if (!fileId) {
//     return res.status(400).send('File ID is required.');
//   }

//   // Construct the GCS public URL
//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;
//   console.log("Google URL:", gcsUrl);

//   try {
//     // Make a request to GCS and stream the video to the client
//     const response = await axios.get(gcsUrl, { responseType: 'stream' });

//     // Set the correct content type based on the GCS response
//     res.setHeader('Content-Type', response.headers['content-type']);
    
//     // Pipe the GCS stream directly to the response
//     response.data.pipe(res);
//   } catch (error) {
//     console.error('Error fetching video:', error.message);
//     res.status(404).send('Video not found.');
//   }
// });

// app.use((req, res, next) => {
//   res.status(404).send("Page not found");
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('An error occurred on the server');
// });

// app.listen(PORT, () => {
//   console.log(`The server is running on the port ${PORT}`);
// });

// function generateRandomId() {
//     let id = "";
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     const charactersLength = characters.length;
//     for (let i = 0; i < 6; i++) {
//         id += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return id;
// }










// const express = require('express');
// const axios = require('axios');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const bucketName = 'veezopro_videos'; // Name of your GCS bucket

// // app.get('/v', async (req, res) => {
// //   const fileId = req.query.id;

// //   if (!fileId) {
// //       return res.status(400).send('File ID is required.');
// //   }

// //   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;
// //   console.log("Google URL:", gcsUrl);

// //   try {
// //       const response = await axios.get(gcsUrl, { responseType: 'stream' });
// //       res.setHeader('Content-Type', response.headers['content-type']);
// //       response.data.pipe(res);
// //   } catch (error) {
// //       console.error('Error fetching video:', error.message);
// //       res.status(404).send('Video not found.');
// //   }
// // });

// app.get('/v', async (req, res) => {
//   const fileId = req.query.id;

//   if (!fileId) {
//       return res.status(400).send('File ID is required.');
//   }

//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;

//   try {
//       const response = await axios.get(gcsUrl, { responseType: 'arraybuffer' });

//       res.setHeader('Content-Type', response.headers['content-type']);
//       res.setHeader('Content-Length', response.data.length);
//       res.status(200).send(response.data);
//   } catch (error) {
//       console.error('Error fetching video:', error.message);
//       res.status(404).send('Video not found.');
//   }
// });


// // Handle 404 for all other routes
// app.use((req, res) => {
//   res.status(404).send("Page not found");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('An error occurred on the server');
// });

// app.listen(PORT, () => {
//   console.log(`The server is running on the port ${PORT}`);
// });







// const express = require('express');
// const axios = require('axios');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Endpoint to handle requests
// app.get('/v', async (req, res) => {
//     const videoId = req.query.id;

//     // Construct the URL to fetch the video from Google Cloud Storage
//     const gcsUrl = `https://storage.googleapis.com/veezopro_videos/${videoId}.mov`;

//     try {
//         // Fetch the video content from GCS
//         const response = await axios.get(gcsUrl, {
//             responseType: 'stream',
//         });

//         // Set the appropriate content type for the video
//         res.set('Content-Type', 'video/quicktime');// or 'video/mp4' if your video is in MP4 format

//         // Pipe the GCS response to the client
//         response.data.pipe(res);
//     } catch (error) {
//         console.error('Error fetching video:', error);
//         res.status(404).send('Video not found');
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const bucketName = 'veezopro_videos'; // GCS bucket name

// // Video streaming endpoint
// // app.get('/v', async (req, res) => {
// //   const videoId = req.query.id;
  
// //   if (!videoId) {
// //     return res.status(400).send('Video ID is required.');
// //   }

// //   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`;

// //   try {
// //     // Request video from GCS
// //     const response = await axios.get(gcsUrl, { responseType: 'stream' });
// //     res.setHeader('Content-Type', 'video/quicktime'); // Adjust type if needed

// //     // Pipe video data to response
// //     response.data.pipe(res);
// //   } catch (error) {
// //     console.error('Error fetching video:', error.message);
// //     res.status(404).send('Video not found.');
// //   }
// // });

// app.get('/v', (req, res) => {
//   const videoId = req.query.id;
//   res.sendFile(path.join(__dirname, 'public', 'video.html'));
// });

// app.get('/v_id=:id', (req, res) => {
//   const fileId = req.params.id; // Get the ID from the URL
//   const filePath = path.join(__dirname, 'public', 'file', `${fileId}.*`); // Match any file extension

//   // Send the file
//   res.sendFile(filePath, (err) => {
//       if (err) {
//           console.error('Error sending file:', err);
//           res.status(404).send('File not found.');
//       }
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');

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
      res.status(200).json({ id: videoId, url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

// Route to serve video file from GCS
// app.get('/v', (req, res) => {
//   const videoId = req.query.id;
//   const fileUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`; // Assuming videos are in .mp4 format
//   res.redirect(fileUrl);
// });
app.get('/v', async (req, res) => {
  const videoId = req.query.id;
  console.log('1Received GET request for video ID:', videoId);
  if (!videoId) {
    return res.status(400).send('Video ID is required.');
  }

  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`;
  try {
    console.log('Get--');
    const response = await axios.get(gcsUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'video/quicktime');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(404).send('Video not found.');
  }
});

app.get(`/api/${id}`, async (req, res) => {
  const videoId = req.query.id;
  console.log('2Received GET request for video ID:', videoId);
  if (!videoId) {
    return res.status(400).send('Video ID is required.');
  }

  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${videoId}.mov`;
  try {
    console.log('Get2--');
    const response = await axios.get(gcsUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'video/quicktime');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(404).send('Video not found.');
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

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
