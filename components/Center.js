import Video from "./Video";

function Center({ data }) {
  return (
    <div>
      {data?.videos.map((video) => (
        <Video key={video.id} video={video} />
      ))}
    </div>
  );
}

export default Center;
