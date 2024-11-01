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
  const { id } = context.params;

  // Construct the API URL to fetch the video from your API route
  const apiUrl = `https://www.veezo.pro/api/${id}`;
  let videoUrl = '';

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      videoUrl = data.url; // Adjust based on your API response structure
    }
  } catch (error) {
    console.error('Error fetching video:', error);
  }

  return {
    props: {
      videoUrl, // Pass the video URL to the page component
    },
  };
}

export default VideoPage;
