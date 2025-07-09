import type { Post } from "./PostList";
import { Link } from "react-router";
interface Props {
  post: Post;
  key: number;
}
export const PostItem = ({ post, key }: Props) => {
  return (
    <div
      key={post.id}
      className="mb-4 p-10 shadow-md rounded-2xl border-2 border-[#E0E0E0]"
    >
      <Link
        to={`post/${post.id}`}
        className="lg:space-x-10 space-y-8 flex lg:flex-row flex-col"
      >
        {/* Avatar */}
        <div className="lg:max-w-[50%] w-full">
          <img
            src={post.img_url}
            alt={post.title}
            className="rounded-2xl"
          ></img>
        </div>
        <div className="flex flex-row gap">
          <div>
            <img></img>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-xl"> {post.title}</h3>
              <p className="italic text-sm">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <p className="italic text-sm">{post.content}</p>
          </div>
        </div>

        <div></div>
      </Link>
    </div>
  );
};
