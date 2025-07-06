import { Menu, X, CircleUser, Github } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { signinWithGithub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 shadow-sm backdrop-blur-lg">
      <div className="max-w-5xl mx-auto py-4">
        <div className="flex justify-between items-center h-16 mx-8">
          <Link to={"/"} className="font-bold text-xl">
            <span className="text-[#4CAF50]">Enviro</span>net
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to={"/"} className="hover:text-[#4CAF50] transition-colors">
              Home
            </Link>
            <Link
              to={"/create"}
              className="hover:text-[#4CAF50] transition-colors"
            >
              Post
            </Link>
            <Link
              to={"/community"}
              className="hover:text-[#4CAF50] transition-colors"
            >
              {" "}
              Community
            </Link>
            <Link
              to={"/event"}
              className="hover:text-[#4CAF50] transition-colors"
            >
              Event
            </Link>
            <Link
              to={"/donate"}
              className="hover:text-[#4CAF50] transition-colors"
            >
              Donate
            </Link>
          </div>

          {/* Hamburger */}
          <div className="flex gap-4">
            <div className="flex gap-4">
              {user ? (
                <div className="flex flex-row gap-4 align-middle justify-between">
                  <div className="flex flex-row gap-2 pr-4 border-3 border-[#4CAF50] rounded-full">
                    {user.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata?.avatar_url}
                        alt="Profile Picture"
                        className="h-10 w-10 rounded-full object-cover "
                      />
                    )}
                    <span className="my-auto font-bold">{displayName}</span>
                  </div>
                  <button
                    className="cursor-pointer hover:font-bold text-white bg-[#4CAF50] hover:bg-[#4CAF50] rounded-lg h-8 my-auto px-2"
                    onClick={signOut}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button className="cursor-pointer">
                    <CircleUser />
                  </button>
                  <button className="cursor-pointer" onClick={signinWithGithub}>
                    <Github />
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="cursor-pointer md:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className=" absolute md:hidden top-20 right-0 left-0">
              <div className="flex flex-col  justify-center bg-[#FBE9E7] px-2 pt-2 pb-3 space-y-1">
                <Link
                  to={"/"}
                  className="block px-3 text-center shadow-md py-2 rounded-md text-base font-medium hover:text-[#4CAF50] "
                >
                  Home
                </Link>
                <Link
                  to={"/create"}
                  className="block px-3 py-2 text-center shadow-md rounded-md text-base font-medium hover:text-[#4CAF50]"
                >
                  Post
                </Link>
                <Link
                  to={"/community"}
                  className="block px-3 py-2 text-center shadow-md rounded-md text-base font-medium hover:text-[#4CAF50]"
                >
                  Community
                </Link>
                <Link
                  to={"/event"}
                  className="block px-3 py-2 text-center shadow-md rounded-md text-base font-medium hover:text-[#4CAF50]"
                >
                  Event
                </Link>
                <Link
                  to={"/donate"}
                  className="block px-3 py-2 text-center shadow-md rounded-md text-base font-medium hover:text-[#4CAF50]"
                >
                  Donate
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
