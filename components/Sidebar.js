function Sidebar() {
  return (
    <div className="hidden md:inline-flex p-3 max-w-[12rem]">
      <div className="space-y-2">
        <button>Login</button>
        <button>Create Playlist</button>
      </div>
    </div>
  );
}

export default Sidebar;
