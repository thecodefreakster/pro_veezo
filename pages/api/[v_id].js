// /pages/api/[v_id].js

export default async function handler(req, res) {
    const { v_id } = req.query;
  
    // Validate `v_id` to ensure it exists and follows a safe pattern
    if (!v_id) {
      return res.status(400).json({ error: "Video ID is missing" });
    }
  
    // Redirect to the Google Cloud Storage URL for the video
    const videoUrl = `https://storage.googleapis.com/veezopro_videos/${v_id}.mov`;
    res.redirect(videoUrl);
  }
  