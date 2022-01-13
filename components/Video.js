function Video({ video }) {
  return (
    <div className="flex flex-col p-2 items-center cursor-pointer">
      <div>
        <img
          className="w-full h-72 object-contain"
          src={video?.thumbnail_url}
          alt=""
        />
      </div>
      <div className="flex flex-col max-w-sm">
        <h1 className="text-xl font-bold truncate">{video?.title}</h1>
        <p>{video?.views} views</p>
        <p className="truncate">{video?.description}</p>
      </div>
    </div>
  );
}

export default Video;
