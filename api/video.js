import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('File ID is required.');
  }

  const bucketName = 'veezopro_videos';
  const gcsUrl = `https://storage.googleapis.com/${bucketName}/${id}.mov`;

  try {
    const response = await axios.get(gcsUrl, { responseType: 'arraybuffer' });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.data.length);
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(404).send('Video not found.');
  }
}
