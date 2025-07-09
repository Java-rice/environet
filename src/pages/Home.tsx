import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="pt-10 space-y-10">
      <h2 className="text-5xl text-center font-bold text-[#4CAF50]">
        Latest Post
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};
