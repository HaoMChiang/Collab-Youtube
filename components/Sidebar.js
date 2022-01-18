import {
  PlusCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ViewListIcon,
  HomeIcon,
} from "@heroicons/react/outline";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalState";
import { db } from "../firebase";

function Sidebar() {
  const { data: session } = useSession();
  const [isModal, setIsModal] = useRecoilState(modalState);
  console.log(session);

  const [playlists, setPlaylists] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    console.log("useEffect ran");
    if (!session) return;
    // onSnapshot(
    //   query(
    //     collection(
    //       db,
    //       "collabtube",
    //       "users",
    //       session.user.email.toString(),
    //       "details",
    //       "playlists"
    //     )
    //   ),
    //   (snapshot) => {
    //     setPlaylists(snapshot.docs);
    //   }
    // );

    onSnapshot(
      query(
        collection(db, "users", session.user.email.toString(), "playlists")
      ),
      (snapshot) => {
        setPlaylists(snapshot.docs);
      }
    );

    // console.log("query: ", querySnapshot);
    console.log("finished useEffect");
  }, [db]);

  // console.log("playlist: ", playlists);

  return (
    <div className="hidden md:inline-flex p-4 text-xs md:text-sm h-screen overflow-y-scroll sm:max-w-[12rem] lg:max-w-[15rem]">
      {/* // <div className="text-gray-500 p-5 text-xs md:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex"> */}
      <div className="space-y-4 flex flex-col overflow-x-clip">
        <div
          className="flex space-x-2 items-center hover:text-gray-300 text-left cursor-pointer"
          onClick={() => router.push("/")}
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </div>
        <button className="text-left hover:text-gray-300">
          {session ? (
            <div className="flex items-center space-x-2" onClick={signOut}>
              <ArrowLeftIcon className="w-5 h-5" />
              <p>Logout</p>
            </div>
          ) : (
            <div
              className="flex items-center space-x-2"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <ArrowRightIcon className="w-5 h-5" />
              <p>Login</p>
            </div>
          )}
        </button>
        {session && (
          <button
            className="text-left hover:text-gray-300"
            onClick={() => setIsModal(true)}
          >
            <div className="flex items-center space-x-2">
              <PlusCircleIcon className="w-5 h-5" />
              <p>Create Playlist</p>
            </div>
          </button>
        )}
        <hr className="border-gray-900 border-t-2" />
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => router.push(`/playlists/${playlist.id}`)}
            className="flex items-center space-x-2 text-left hover:text-gray-300 cursor-pointer"
          >
            <ViewListIcon className="h-5 w-5" />
            <p className="truncate">{playlist.data().playlistName}</p>
            {/* <p>{playlist.id}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
//   const providers = await getProviders();
//   console.log(providers);
//   return {
//     props: {
//       providers,
//     },
//   };
// }

export default Sidebar;
