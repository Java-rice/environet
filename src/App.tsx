import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
function App() {
  return (
    <div className="min-h-screen bg-[#FBE9E7] text-[#424242] transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/create" element={<CreatePostPage />}></Route>
          <Route path="/post/:id" element={<PostPage />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
