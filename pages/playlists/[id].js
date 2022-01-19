import { onSnapshot, query, collection } from "firebase/firestore";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Center from "../../components/Center";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import { TrashIcon } from "@heroicons/react/outline";

function Playlists() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log("useEffect in [id].js ran");
    if (!session) return;
    console.log("param: ", id);
    try {
      onSnapshot(
        query(
          collection(
            db,
            "users",
            session.user.email.toString(),
            "playlists",
            id,
            "videos"
          )
        ),
        (snapshot) => {
          setVideos(snapshot.docs.map((doc) => doc.data()));
        }
      );
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }

    console.log("finished running useEffect");
    return;
  }, [db, id]);

  return (
    <div className="h-screen overflow-hidden w-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-5 overflow-y-scroll h-screen space-y-4">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="flex flex-grow grid-cols-3 items-center justify-between md:p-3 cursor-pointer hover:bg-gray-300 rounded-lg"
            >
              <img src={video.imageUrl} alt="" className="w-28" />
              <div className="flex-grow md:ml-2">
                <h1 className="font-bold text-lg truncate lg:max-w-4xl max-w-xs">
                  {video.title}
                </h1>
                <p className="truncate lg:max-w-4xl max-w-xs text-md">
                  {video.description}
                </p>
                <p>{video.views} views</p>
              </div>
              <div className="rounded-full hover:bg-gray-400 p-1">
                <TrashIcon className="h-10 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Playlists;

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
