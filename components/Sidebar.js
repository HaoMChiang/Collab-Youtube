import {
  PlusCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="hidden md:inline-flex p-4 text-xs md:text-sm h-screen overflow-y-scroll sm:max-w-[12rem] lg:max-w-[15rem]">
      <div className="space-y-4 flex flex-col">
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
          <button className="text-left hover:text-gray-300">
            <div className="flex items-center space-x-2">
              <PlusCircleIcon className="w-5 h-5" />
              <p>Create Playlist</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  console.log(providers);
  return {
    props: {
      providers,
    },
  };
}

export default Sidebar;
