function Sidebar() {
  return (
    <div className="hidden md:inline-flex p-3 max-w-[12rem]">
      <div className="space-y-2 flex flex-col">
        <button className="text-left">Login</button>
        <button className="text-left">Create Playlist</button>
      </div>
    </div>
  );
}

export default Sidebar;
