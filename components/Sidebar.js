import { PlusCircleIcon, ArrowRightIcon } from "@heroicons/react/outline";

function Sidebar() {
  return (
    <div className="hidden md:inline-flex p-4 text-xs md:text-sm h-screen overflow-y-scroll sm:max-w-[12rem] lg:max-w-[15rem]">
      <div className="space-y-4 flex flex-col">
        <button className="text-left hover:text-gray-300">
          <div className="flex items-center space-x-2">
            <ArrowRightIcon className="w-5 h-5" />
            <p>Login</p>
          </div>
        </button>
        <button className="text-left hover:text-gray-300">
          <div className="flex items-center space-x-2">
            <PlusCircleIcon className="w-5 h-5" />
            <p>Create Playlist</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
