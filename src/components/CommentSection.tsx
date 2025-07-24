import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

type FormData = {
  content: string;
};

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must login to comment");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const CommentSection = ({ postId }: Props) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>();

  const { mutate } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
  });

  const onSubmit = (data: FormData) => {
    if (!user) {
      toast.error("You must be logged in to submit a post.");
      return;
    }

    mutate({ content: data?.content, parent_comment_id: null });
    reset();
  };

  return (
    <div>
      <h3>Comments</h3>
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <textarea
            rows={4}
            placeholder="Share your thoughts..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 10,
                message: "Content must be at least 10 characters long",
              },
              maxLength: {
                value: 1000,
                message: "Content must be less than 1000 characters",
              },
            })}
            className="px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
          ></textarea>
          <Button type="submit" variant="default" width="long">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      ) : (
        <p>You Must Login to continue Commenting</p>
      )}
    </div>
  );
};
