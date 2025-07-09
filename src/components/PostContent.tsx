import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
interface Props {
  postId: number;
}
import { useQuery } from "@tanstack/react-query";

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
    <div className="max-w-5xl mx-auto">
      <h2>{data?.title}</h2>
      <p>
        Posted On:{" "}
        {new Date(data!.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <img src={data?.img_url} alt={data?.title} className="rounded-2xl"></img>
      <p>{data?.content}</p>
    </div>
  );
};
