function Video({ video }) {
  return (
    <div className="max-w-sm rounded overflow-hidden cursor-pointer hover:scale-105 transition transform ease-in duration-200">
      <img className="w-full" src={video?.thumbnail_url} alt="" />
      <div className="px-1 py-4">
        <div className="font-bold text-xl mb-2 truncate">{video?.title}</div>
        <p className="text-base truncate text-gray-500">{video?.description}</p>
        <p className="truncate text-gray-500 mt-[0.5px]">
          {video?.views} views
        </p>
      </div>
    </div>
  );
}

export default Video;
