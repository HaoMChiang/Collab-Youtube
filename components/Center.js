import Video from "./Video";

function Center({ data }) {
  return (
    <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 justify-center flex-wrap">
      {data?.videos?.map((video) => (
        <Video key={video.id} video={video} />
      ))}
    </div>
  );
}

export default Center;
