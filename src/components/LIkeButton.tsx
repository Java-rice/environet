import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./Button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
interface Props {
  postId: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("votes").insert({
      post_id: postId,
      user_id: userId,
      vote: voteValue,
    });
    if (error) throw new Error(error.message);
  }
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to Vote!");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: (_, voteValue) => {
      toast.success(
        `${
          voteValue == 1
            ? "Post Liked successfully"
            : "Post Disliked successfully"
        }`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Like failed");
    },
  });

  return (
    <div>
      <button
        onClick={() => mutate(1)}
        className="p-2 rounded-full  cursor-pointer transition duration-200"
        title="Like"
      >
        <ThumbsUp className="text-gray-500 hover:text-green-500 transition duration-200" />
      </button>
      <button
        onClick={() => mutate(-1)}
        className="p-2 rounded-full  cursor-pointer transition duration-200"
        title="Dislike"
      >
        <ThumbsDown className="text-gray-500 hover:text-red-500 transition duration-200" />
      </button>
    </div>
  );
};
