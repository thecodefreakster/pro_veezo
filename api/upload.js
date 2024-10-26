const multer = require('multer');
const path = require('path');

// Set up multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'file'); // Save to /public/file
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileId = generateRandomId(); // Generate a unique ID
        const fileExtension = path.extname(file.originalname);
        cb(null, fileId + fileExtension); // e.g., '12nr13.mp4'
    }
});

const upload = multer({ storage: storage });

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('file')(req, res, function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Extract the ID from the uploaded file name
            const fileId = path.parse(req.file.filename).name; // Get the ID from filename without extension
            const fileExtension = path.extname(req.file.originalname);
            const fileUrl = `https://veezo.pro/v_id=${fileId}`; // Adjust this URL as needed

            res.status(200).json({ id: fileId, url: fileUrl });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

function generateRandomId() {
    return Math.random().toString(36).substring(2, 8);
}
