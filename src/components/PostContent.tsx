import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
interface Props {
  postId: number;
}
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { LikeButton } from "./LIkeButton";
import { CommentSection } from "./CommentSection";

const fetchPostByID = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
};

export const PostContent = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["content", postId],
    queryFn: () => fetchPostByID(postId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 mt-10">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-center">{data?.title}</h2>

        <div className="flex flex-row gap-4 justify-center align-middle">
          {data?.avatar_url ? (
            <img
              src={data?.avatar_url}
              alt={data?.title}
              className="rounded-full h-12 w-12 "
            ></img>
          ) : (
            <User size={8} />
          )}

          <p className="text-center italic my-auto">
            Posted On:{" "}
            {new Date(data!.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <img
        src={data?.img_url}
        alt={data?.title}
        className="rounded-2xl max-w-2xl mx-auto"
      ></img>
      <div>
        <p>{data?.content}</p>
      </div>
      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};
