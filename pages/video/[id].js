// import { useRouter } from 'next/router';

// const VideoPage = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   // Show loading state until the id is available
//   if (!id) return <p>Loading...</p>;

//   return (
//     <div className="flex justify-center items-center w-screen h-screen bg-gray-900">
//       <div className="video-container max-w-4xl w-full p-4">
//         <video controls autoPlay width="100%" className="rounded-lg shadow-lg">
//           <source src={`/v?id=${id}`} type="video/quicktime" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   );
// };

// export default VideoPage;


// pages/video/[id].js

import React from 'react';

export async function getServerSideProps(context) {
  const { id } = context.query;

  // Construct the URL to the video
  const videoUrl = `https://storage.googleapis.com/veezopro_videos/${id}.mov`;

  // Check if the video exists (optional)
  const res = await fetch(videoUrl);
  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      videoUrl,
    },
  };
}

const VideoPage = ({ videoUrl }) => {
  return (
    <div>
      <h1>Video Page</h1>
      <video controls width="600">
        <source src={videoUrl} type="video/quicktime" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPage;
