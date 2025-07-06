import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { toast } from "react-toastify";

type FormData = {
  title: Text;
  content: Text;
};

export const CreatePost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted", data);
    toast.success("Post submitted successfully");
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {" "}
      <div className="flex flex-col gap-2">
        <label>Title</label>
        <input
          type="text"
          required
          {...register("title", { required: "Name is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Content</label>
        <textarea
          type="textbox"
          required
          {...register("content", { required: "Content is required" })}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" variant="default">
        Submit
      </Button>
    </form>
  );
};
