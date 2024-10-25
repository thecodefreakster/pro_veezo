const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory (no disk)
const upload = multer({ storage: storage });

export default function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Generate file URL (you may need to use a third-party storage service)
      const fileId = generateRandomId();
      const fileExtension = path.extname(req.file.originalname);
      const filename = fileId + fileExtension;
      const fileUrl = `https://storage.googleapis.com/veezopro_videos/${filename}`;

      res.status(200).json({ id: fileId, url: fileUrl });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 8);
}
