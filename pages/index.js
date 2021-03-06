import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import Modal from "../components/Modal";
import { useRecoilValue } from "recoil";
import { modalState, VideoMenuState } from "../atoms/modalState";
import { getSession, useSession } from "next-auth/react";
import VideoSaveMenu from "../components/VideoSaveMenu";
// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { query, onSnapshot, collection } from "firebase/firestore";

export default function Home({ data }) {
  const isModal = useRecoilValue(modalState);
  const isVideoMenu = useRecoilValue(VideoMenuState);
  // const [playlists, setPlaylists] = useState([]);
  // const { data: session } = useSession();

  // useEffect(async () => {
  //   console.log("useEffect ran");
  //   if (!session) return;
  //   onSnapshot(
  //     query(collection(db, session.user.email.toString())),
  //     (snapshot) => {
  //       setPlaylists(snapshot.docs);
  //     }
  //   );
  //   console.log("finished useEffect");
  // }, [db]);

  // {
  //   playlists.map((playlist) => {
  //     console.log("index: ", playlist.data().name);
  //   });
  // }

  return (
    <div className="h-screen overflow-hidden">
      <Head>
        <title>CollabTube</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex">
          <Sidebar />
          <Center data={data} />
          {isModal && <Modal />}
          {isVideoMenu && <VideoSaveMenu />}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await fetch(
    "https://mock-youtube-api.herokuapp.com/api/videos"
  ).then((res) => res.json());

  return {
    props: {
      data,
      session: await getSession(context),
    },
  };
}
