function Video({ video }) {
  return (
    <div className="flex flex-col p-2">
      <div>
        <img
          className="w-96 h-72 object-contain"
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
