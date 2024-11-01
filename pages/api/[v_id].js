import { useEffect } from 'react';

const VideoPage = ({ videoUrl }) => {
  useEffect(() => {
    // Optionally, you can perform additional actions like analytics tracking when the component mounts.
  }, []);

  return (
    <div>
      <h1>Video Player</h1>
      {videoUrl ? (
        <video width="600" controls>
          <source src={videoUrl} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Video not found.</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  console.log('Get----');
  const { id } = context.params;

  // Construct the direct GCS URL to fetch the video
  const videoUrl = `https://storage.googleapis.com/veezopro_videos/${id}.mov`;

  // Optionally check if the video exists (this step is not mandatory)
  let exists = false;
  try {
    const response = await fetch(videoUrl);
    exists = response.ok; // true if video exists
  } catch (error) {
    console.error('Error fetching video:', error);
  }

  // Return the video URL if it exists, otherwise return an empty string
  return {
    props: {
      videoUrl: exists ? videoUrl : '', // If the video doesn't exist, pass an empty string
    },
  };
}

export default VideoPage;
