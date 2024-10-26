// const multer = require('multer');
// const path = require('path');

//  const storage = multer.memoryStorage(); // Store files in memory (no disk)
// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, path.join(__dirname, '..', 'public', 'file')); // Adjust path
// //     },
// //     filename: function (req, file, cb) {
// //       const videoId = generateRandomId();
// //       const fileExtension = path.extname(file.originalname);
// //       cb(null, videoId + fileExtension);
// //     }
// //   });

// const upload = multer({ storage: storage });

// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     upload.single('file')(req, res, function (err) {
//       if (err) return res.status(500).json({ error: err.message });

//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }

//       // Generate file URL (you may need to use a third-party storage service)
//       const fileId = generateRandomId();
//       const fileExtension = path.extname(req.file.originalname);
//       const filename = fileId + fileExtension;
//       const fileUrl = `https://storage.googleapis.com/veezopro_videos/${filename}`;

//       res.status(200).json({ id: fileId, url: fileUrl });
//     });
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }

// function generateRandomId() {
//   return Math.random().toString(36).substring(2, 8);
// }

// api/upload.js

// Import required modules
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer'); // Make sure you install multer

// Create a new Google Cloud Storage client
const storage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS), // Use the environment variable
});

// Replace with your bucket name
const bucketName = 'veezopro_videos';

// Setup multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory as Buffer
});

// Define the upload function
async function handleUpload(req, res) {
    try {
        const fileStream = req.file; // Get the uploaded file stream

        // Define the file name and path in the bucket
        const fileName = fileStream.originalname;
        const bucketFile = storage.bucket(bucketName).file(fileName);

        // Upload the file to Google Cloud Storage
        const stream = bucketFile.createWriteStream({
            metadata: {
                contentType: fileStream.mimetype, // Set the correct content type
            },
        });

        // Pipe the file stream to the bucket
        stream.on('error', (err) => {
            console.error('Error uploading file:', err);
            res.status(500).send('Error uploading file');
        });

        stream.on('finish', () => {
            console.log('File uploaded successfully');
            res.status(200).send('File uploaded successfully!');
        });

        // Pipe the uploaded file buffer (or stream) to the GCS stream
        stream.end(fileStream.buffer); // Use the file buffer from multer
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading file');
    }
}

// Export the upload function to handle POST requests
module.exports = (req, res) => {
    if (req.method === 'POST') {
        return upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).send('Error uploading file: ' + err.message);
            }
            return handleUpload(req, res);
        });
    }
    return res.status(405).send('Method Not Allowed');
};
