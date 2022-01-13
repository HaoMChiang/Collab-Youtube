import Video from "./Video";

function Center({ data }) {
  return (
    <div className="flex-grow bg-gray-100 p-5">
      <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 justify-center flex-wrap space-x-2 space-y-2">
        {data?.videos?.map((video) => (
          <Video key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Center;
