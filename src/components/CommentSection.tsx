import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabase } from "../supabase-client";

// Props passed to the component
interface Props {
  postId: number;
}

// Form input types
type FormData = {
  content: string;
};

// Structure for the new comment insertion
interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

// Function to insert a comment into the Supabase database
const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  // Ensure user is logged in
  if (!userId || !author) {
    throw new Error("You must login to comment");
  }

  // Insert comment into Supabase
  const { error } = await supabase.from("comment").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  // Throw error if insertion failed
  if (error) {
    throw new Error(error.message);
  }
};

export const CommentSection = ({ postId }: Props) => {
  const { user } = useAuth();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  // useMutation hook from React Query for handling comment creation
  const { mutate } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      toast.success("Comment posted successfully!");
      reset(); // Clear form after successful submission
    },
    onError: (error: Error) => {
      toast.error(error.message); // Show error to user
    },
  });

  // Handles form submission
  const onSubmit = (data: FormData) => {
    if (!user) {
      toast.error("You must be logged in to submit a comment.");
      return;
    }

    // Submit comment with no parent (top-level comment)
    mutate({ content: data.content, parent_comment_id: null });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {user ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-3"
        >
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
          />
          {/* Display validation error */}
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}

          <Button type="submit" variant="default" width="long">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      ) : (
        <p className="text-gray-600">You must log in to comment.</p>
      )}
    </div>
  );
};
