import { PlusIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

function Video({ video }) {
  const { data: session } = useSession();

  return (
    <div className="max-w-sm rounded overflow-hidden cursor-pointer hover:scale-105 transition transform ease-in duration-200">
      <img className="w-full" src={video?.thumbnail_url} alt="" />
      <div className="px-1 py-4">
        <div className="font-bold text-xl mb-2 truncate">{video?.title}</div>
        <p className="text-base truncate text-gray-500">{video?.description}</p>
        <div className="flex items-center justify-between">
          <p className="truncate text-gray-500 mt-[0.5px]">
            {video?.views} views
          </p>
          {session && (
            <div className="flex items-center space-x-2 mr-2 hover:text-gray-300">
              <PlusIcon className="w-5 h-5 rounded-full" />
              <p>Save</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Video;
