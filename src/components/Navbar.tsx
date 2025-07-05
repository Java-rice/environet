import { Menu, X, CircleUser } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <div>
        <div>
          <Link to={"/"} className="font-bold">
            <span className="text-[#4CAF50]">Enviro</span>net
          </Link>
          <div>
            <Link to={"/"}>Home</Link>
            <Link to={"/create"}>Post</Link>
            <Link to={"/community"}>Community</Link>
            <Link to={"/community/create"}>Create Community</Link>
            <Link to={"/event"}>Event</Link>
            <Link to={"/donate"}>Donate</Link>
            <button>
              <CircleUser />
            </button>
          </div>

          {/* Hamburger */}
          <div>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="">
              <div>
                <Link to={"/"}>Home</Link>
                <Link to={"/create"}>Post</Link>
                <Link to={"/community"}>Community</Link>
                <Link to={"/community/create"}>Create Community</Link>
                <Link to={"/event"}>Event</Link>
                <Link to={"/donate"}>Donate</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
