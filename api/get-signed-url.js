const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'veezopro_videos'; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ error: "File name is required" });
    }

    try {
        const [url] = await storage.bucket(bucketName)
            .file(fileName)
            .getSignedUrl({
                action: 'write',
                version: 'v4',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            });

        res.json({ url });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: "Could not generate signed URL" });
    }
}
