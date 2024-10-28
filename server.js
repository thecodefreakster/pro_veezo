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

// // app.get('/v', (req, res) => {
// //   const videoId = req.query.id;
// //   res.sendFile(path.join(__dirname, 'public', 'video.html'));
// // });

// // app.get('/v_id=:id', (req, res) => {
// //   const fileId = req.params.id; // Get the ID from the URL
// //   const filePath = path.join(__dirname, 'public', 'file', `${fileId}.*`); // Match any file extension

// //   // Send the file
// //   res.sendFile(filePath, (err) => {
// //       if (err) {
// //           console.error('Error sending file:', err);
// //           res.status(404).send('File not found.');
// //       }
// //   });
// // });

// app.get('/v', async (req, res) => {
//   const fileId = req.query.id; // Get the file ID from the query parameter

//   if (!fileId) {
//     return res.status(400).send('File ID is required.');
//   }

//   // Construct the GCS public URL
//   //const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;
//   const gcsURL = `https://storage.googleapis.com/veezopro_videos/k50pok.mov`
//   console.log("googleurl--", gcsUrl);
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










const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const bucketName = 'veezopro_videos'; // Name of your GCS bucket

// app.get('/v', async (req, res) => {
//   const fileId = req.query.id;

//   if (!fileId) {
//       return res.status(400).send('File ID is required.');
//   }

//   const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;
//   console.log("Google URL:", gcsUrl);

//   try {
//       const response = await axios.get(gcsUrl, { responseType: 'stream' });
//       res.setHeader('Content-Type', response.headers['content-type']);
//       response.data.pipe(res);
//   } catch (error) {
//       console.error('Error fetching video:', error.message);
//       res.status(404).send('Video not found.');
//   }
// });

app.get('/v', async (req, res) => {
  const fileId = req.query.id;

  if (!fileId) {
      return res.status(400).send('File ID is required.');
  }

  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileId}.mov`;

  try {
      const response = await axios.get(gcsUrl, { responseType: 'arraybuffer' });

      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Content-Length', response.data.length);
      res.status(200).send(response.data);
  } catch (error) {
      console.error('Error fetching video:', error.message);
      res.status(404).send('Video not found.');
  }
});


// Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred on the server');
});

app.listen(PORT, () => {
  console.log(`The server is running on the port ${PORT}`);
});
