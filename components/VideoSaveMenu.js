import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { currVideoState, VideoMenuState } from "../atoms/modalState";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

function VideoSaveMenu() {
  const cancelButtonRef = useRef(null);
  const { data: session } = useSession();
  const [videoMenu, setVideoMenuState] = useRecoilState(VideoMenuState);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currVideo, setCurrVideo] = useRecoilState(currVideoState);
  const [likeVideos, setLikeVideos] = useState([]);

  useEffect(() => {
    if (!session) return;
    try {
      onSnapshot(
        query(
          collection(db, "users", session.user.email.toString(), "playlists")
        ),
        (snapshot) => {
          setPlaylists(snapshot.docs);
        }
      );
    } catch (error) {
      console.error("Error fetching playlists: ", error);
    }
    return;
  }, [db]);

  useEffect(() => {
    if (!session) return;
    try {
      onSnapshot(
        query(
          collection(
            db,
            "users",
            session.user.email.toString(),
            "likes",
            currVideo.video_id,
            "playlists"
          )
        ),
        (snapshot) => {
          setLikeVideos(snapshot.docs.map((doc) => doc.data().playlistId));
        }
      );
    } catch (error) {
      console.log("Error fetching liked videos: ", error);
    }
    return;
  }, [db]);

  const saveToPlaylist = async (event, playlist) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const docRef = await setDoc(
        doc(
          db,
          "users",
          session.user.email.toString(),
          "playlists",
          playlist.id,
          "videos",
          currVideo.video_id
        ),
        {
          title: currVideo.title,
          views: currVideo.views,
          description: currVideo.description,
          imageUrl: currVideo.thumbnail_url,
          videoId: currVideo.video_id,
          timestamp: serverTimestamp(),
        }
      );

      await setDoc(
        doc(
          db,
          "users",
          session.user.email.toString(),
          "likes",
          currVideo.video_id,
          "playlists",
          playlist.id
        ),
        {
          playlistsName: playlist.data().playlistName,
          playlistId: playlist.id,
        }
      );
    } catch (error) {
      console.error("Save to playlist error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromPlaylist = async (event, playlist) => {
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
          playlist.id,
          "videos",
          currVideo.video_id
        )
      );

      await deleteDoc(
        doc(
          db,
          "users",
          session.user.email.toString(),
          "likes",
          currVideo.video_id,
          "playlists",
          playlist.id
        )
      );
    } catch (err) {
      console.error("remove error: ", err);
    } finally {
      setIsLoading(false);
    }
    return;
  };

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setVideoMenuState}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Save to ...
                    </Dialog.Title>
                    <div className="flex flex-col items-center border-b border-blue-500 py-2">
                      {playlists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center space-x-4 mr-auto p-2 text-lg"
                        >
                          {likeVideos.includes(playlist.id) ? (
                            <div
                              onClick={(e) => removeFromPlaylist(e, playlist)}
                              className="cursor-pointer"
                            >
                              <HeartIconSolid className="w-10 h-10" />
                            </div>
                          ) : (
                            <div
                              onClick={(e) => saveToPlaylist(e, playlist)}
                              className="cursor-pointer"
                            >
                              <HeartIcon className="w-10 h-10" />
                            </div>
                          )}

                          <label className="truncate">
                            {playlist.data().playlistName}
                          </label>
                          <p>{playlist.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setVideoMenuState(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default VideoSaveMenu;
