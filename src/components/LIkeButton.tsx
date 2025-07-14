import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
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

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);
  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to Vote!");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: async (_, voteValue) => {
      toast.success(
        `${
          voteValue == 1
            ? "Post Like Status Changed successfully"
            : "Post Dislike Status Changed successfully"
        }`
      );
      await queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
    onError: (error) => {
      toast.error(error.message || "Like failed");
    },
  });

  if (isLoading) {
    return <div>Vote is Loading</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div>
      <button
        onClick={() => mutate(1)}
        className="p-2 rounded-full  cursor-pointer transition duration-200"
        title="Like"
      >
        <ThumbsUp
          className={`text-gray-500 ${
            userVote === 1 && "text-green-500"
          } hover:text-green-500 transition duration-200`}
        />{" "}
        {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className="p-2 rounded-full  cursor-pointer transition duration-200"
        title="Dislike"
      >
        <ThumbsDown
          className={`text-gray-500 ${
            userVote === -1 && "text-red-500"
          } hover:text-red-500 transition duration-200`}
        />{" "}
        {dislikes}
      </button>
    </div>
  );
};
