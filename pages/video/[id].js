import { useRouter } from 'next/router';

const VideoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Show loading state until the id is available
  if (!id) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-900">
      <div className="video-container max-w-4xl w-full p-4">
        <video controls autoPlay width="100%" className="rounded-lg shadow-lg">
          <source src={`/v?id=${id}`} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPage;
