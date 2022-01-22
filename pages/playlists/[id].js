import {
  onSnapshot,
  query,
  collection,
  deleteDoc,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Center from "../../components/Center";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { modalState } from "../../atoms/modalState";
import Modal from "../../components/Modal";

function Playlists() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isModal = useRecoilValue(modalState);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // console.log("useEffect in [id].js ran");
    if (!session) {
      router.push("/");
      return;
    }
    // console.log("param: ", id);
    try {
      onSnapshot(
        query(doc(db, "users", session.user.email.toString(), "playlists", id)),
        (snapshot) => {
          if (snapshot.data() === undefined) {
            router.push("/");
            return;
          }
          setTitle(snapshot.data()?.playlistName);
          setVideos(snapshot.data()?.videos);
          // console.log("id fetch: ", snapshot.data());
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
      await runTransaction(db, async (transaction) => {
        const listDocRef = doc(
          db,
          "users",
          session.user.email.toString(),
          "playlists",
          id
        );
        const listDoc = await transaction.get(listDocRef);

        const newVideos = listDoc
          .data()
          .videos.filter((video) => video.video_id !== videoId);
        transaction.update(listDocRef, { videos: newVideos });
      });

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

  async function handleOnDragEnd(result) {
    if (!result.destination) return;
    console.log("Result before: ", videos);
    console.log("result: ", result);
    console.log("Result after: ", videos);
    try {
      await runTransaction(db, async (transaction) => {
        const listDocRef = doc(
          db,
          "users",
          session.user.email.toString(),
          "playlists",
          id
        );
        const items = Array.from(videos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        transaction.update(listDocRef, { videos: items });
      });
    } catch (err) {
      console.error(err);
    }
  }

  const deletePlaylist = async () => {
    videos?.forEach(async (video) => {
      try {
        await deleteDoc(
          doc(
            db,
            "users",
            session.user.email.toString(),
            "likes",
            video.video_id,
            "playlists",
            id
          )
        );
      } catch (error) {
        console.error(error);
      }
    });

    try {
      await deleteDoc(
        doc(db, "users", session.user.email.toString(), "playlists", id)
      );
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="h-screen overflow-hidden w-screen">
      <div className="flex">
        {isModal && <Modal />}
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-4 overflow-y-scroll h-screen">
          {session && (
            <div className="flex items-center space-x-4">
              <h1 className="font-bold text-xl">Playlist: {title}</h1>
              <h2>Total: {videos?.length} videos</h2>
              <div
                onClick={deletePlaylist}
                className="flex items-center space-x-1 cursor-pointer hover:bg-gray-300 rounded-lg p-1 font-medium"
              >
                <p>Delete Playlist</p>
                <XIcon className="h-5 w-5" />
              </div>
            </div>
          )}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="savedVideos">
              {(provided) => (
                <div
                  className="flex-grow bg-gray-100 p-5 overflow-y-scroll h-screen space-y-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {videos?.map((video, idx) => (
                    <Draggable
                      key={video.video_id}
                      draggableId={video.video_id}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          // key={video.video_id}
                          className="flex flex-grow grid-cols-3 items-center justify-between md:p-3 cursor-pointer hover:bg-gray-300 rounded-lg"
                        >
                          <img
                            src={video.thumbnail_url}
                            alt=""
                            className="w-28"
                          />
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
                            onClick={(e) =>
                              removeFromPlaylist(e, video.video_id)
                            }
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
