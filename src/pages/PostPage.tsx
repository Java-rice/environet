import { PostContent } from "../components/PostContent";
import { useParams } from "react-router";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-10 space-y-10">
      <div>
        <PostContent postId={Number(id)} />
      </div>
    </div>
  );
};
