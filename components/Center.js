import Video from "./Video";

function Center({ data }) {
  return (
    <div className="flex-grow bg-gray-100 p-5 overflow-y-scroll h-screen">
      <div className="sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex justify-center flex-wrap px-5 py-10 gap-4">
        {data?.videos?.map((video) => (
          <Video key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Center;
