import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  img_url: string;
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
    <div className="max-w-5xl flex justify-center flex-col mx-auto">
      {data?.map((post) => (
        <div key={post.id} className="mb-4 p-4 border shadow-md">
          <img src={post.img_url}></img>
          <h3> {post.title}</h3>
          <p> {post.content}</p>
        </div>
      ))}
    </div>
  );
};
