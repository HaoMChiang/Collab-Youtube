import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Center from "../../components/Center";
import Sidebar from "../../components/Sidebar";

function Playlists() {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div>
      <Sidebar />
    </div>
  );
}

export default Playlists;
