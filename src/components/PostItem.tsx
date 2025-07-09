import { toast } from "react-toastify";
import type { Post } from "./PostList";
import { Link } from "react-router";
import { User } from "lucide-react";
interface Props {
  post: Post;
  key: number;
}
export const PostItem = ({ post, key }: Props) => {
  return (
    <div
      key={post.id}
      className="p-4 shadow-md rounded-2xl border-2 hover:border-[#4CAF50] hover:border-3 border-[#E0E0E0]"
    >
      <Link
        to={`post/${post.id}`}
        className="space-y-6 flex flex-col"
        onClick={() => {
          toast.success(`Navigating to ${post.title}`);
        }}
      >
        {/* Avatar */}

        <div className="flex w-full overflow-hidden flex-row gap-4">
          <div className="flex-shrink-0">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt={post.title}
                className="rounded-full h-12 w-12 "
              ></img>
            ) : (
              <User size={12} />
            )}
          </div>
          <div className="py-1">
            <h3 className="font-bold text-xl text-wrap">{post.title}</h3>
            <p className="italic text-sm leading-snug">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="w-full">
          <img
            src={post.img_url}
            alt={post.title}
            className="rounded-2xl"
          ></img>
        </div>

        <div></div>
      </Link>
    </div>
  );
};
