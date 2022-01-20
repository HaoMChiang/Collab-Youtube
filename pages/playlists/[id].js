import {
  onSnapshot,
  query,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Center from "../../components/Center";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import { TrashIcon } from "@heroicons/react/outline";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";

function Playlists() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const removeFromPlaylist = async (event, videoId) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          session.user.email.toString(),
          "playlists",
          id,
          "videos",
          videoId
        )
      );

      await deleteDoc(
        doc(
          db,
          "users",
          session.user.email.toString(),
          "likes",
          videoId,
          "playlists",
          id
        )
      );
    } catch (err) {
      console.error("remove error: ", err);
    } finally {
      setIsLoading(false);
    }
    return;
  };

  function handleOnDragEnd(result) {
    console.log("Result: ", result);
  }

  return (
    <div className="h-screen overflow-hidden w-screen">
      <div className="flex">
        <Sidebar />
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="savedVideos">
            {(provided) => (
              <div
                className="flex-grow bg-gray-100 p-5 overflow-y-scroll h-screen space-y-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {videos.map((video, idx) => (
                  <Draggable
                    key={video.videoId}
                    draggableId={video.videoId}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        // key={video.videoId}
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
                        <div
                          className="rounded-full hover:bg-gray-400 p-1"
                          onClick={(e) => removeFromPlaylist(e, video.videoId)}
                        >
                          <TrashIcon className="h-10 w-10" />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Playlists;

export async function getServerSideProps(context) {
  // resetServerContext();
  return {
    props: {
      session: await getSession(context),
    },
  };
}
