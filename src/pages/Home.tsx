import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="">
      <h2>Latest Post</h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};
