import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  img_url: string;
  avatar_url: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) <div>Loading...</div>;
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-5xl grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mx-auto">
      {data?.map((post, key) => (
        <>
          <PostItem key={post.id} post={post} />
        </>
      ))}
    </div>
  );
};
