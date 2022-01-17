/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { VideoCameraIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalState";
import { db } from "../firebase";
import {
  doc,
  addDoc,
  setDoc,
  collection,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function Modal() {
  const cancelButtonRef = useRef(null);
  const [isModal, setIsModal] = useRecoilState(modalState);
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const createPlaylist = async () => {
    console.log("createPlaylist ran");
    if (loading || playlistName.length == 0) return;
    setLoading(true);
    console.log("start try");
    try {
      const docRef = await addDoc(
        collection(db, session.user.email.toString()),
        {
          gmail: session.user.email,
          playlistName: playlistName,
          createdTime: serverTimestamp(),
        }
      );
      //   .collection("users")
      //   .doc(session.user.email)
      //   .collection("playlist")
      //   .add({
      //     playlistName: playlistName,
      //     timestamp: serverTimestamp(),
      //   });
      console.log("create playlist: ", docRef.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsModal(false);
      setPlaylistName("");
    }
    console.log("end createplaylist");
  };

  return (
    <Transition.Root show={isModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        // initialFocus={cancelButtonRef}
        onClose={setIsModal}
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <VideoCameraIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Name
                    </Dialog.Title>
                    <div className="mt-2">
                      {/* <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed. This action
                        cannot be undone.
                      </p> */}
                      <div className="flex items-center border-b border-blue-500 py-2">
                        <input
                          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                          type="text"
                          placeholder="Enter playlist name"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                          aria-label="playlist name"
                        />
                      </div>
                      <div>{playlistName}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => createPlaylist()}
                >
                  Create Playlist
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModal(false)}
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
