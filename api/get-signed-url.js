import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_KEY),
});

export default async function handler(req, res) {
    const { bucketName, fileName } = req.query;

    if (!bucketName || !fileName) {
        return res.status(400).json({ error: 'Missing bucketName or fileName in request' });
    }

    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: 'video/quicktime',  // Set your required content type here
    };

    try {
        const [url] = await storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);

        res.status(200).json({ url });
    } catch (error) {
        console.error('Error generating signed URL:', error.message);
        res.status(500).json({ error: `Could not generate signed URL: ${error.message}` });
    }
}