import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "./Button";
import { supabase } from "../supabase-client";
import React, { useState } from "react";
import { File, Image } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { User } from "@supabase/supabase-js";
// The form data types
type FormData = {
  title: string;
  content: string;
  image: FileList;
  avatar_url: string | null;
};

const createPost = async (post: FormData, user: User) => {
  //Create Unique File Extension
  const file = post.image[0];
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  //First is Upload data, so it will store the data and uploadError if theres any
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);

  //If theres an error it will display fail
  if (uploadError)
    throw new Error("File upload failed: " + uploadError.message);

  //It will get public URL and store it on imageURL , the data that will be used to find it is the fileName
  const imageUrl = supabase.storage.from("post-images").getPublicUrl(fileName)
    .data.publicUrl;

  //Then post it on the database (supabase) with the title, content and image url
  const { data, error } = await supabase.from("posts").insert({
    title: post.title,
    content: post.content,
    img_url: imageUrl,
    avatar_url: user?.user_metadata.avatar_url || null,
  });

  // if theres an error on data base it will be displayed
  if (error) throw new Error("Database insert failed: " + error.message);
  return data;
};

export const CreatePost = () => {
  // Preview the URL posted
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();

  //Create a useForm with FormData type, it will also show the register, handleSubmit,formState, reset and SetValue
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>();

  // Watch the image field to trigger validation
  const watchedImage = watch("image");

  //Create mutation function to check what happen onSuccess and onError
  const { mutate } = useMutation({
    mutationFn: async ({ data, user }: { data: FormData; user: User }) =>
      await createPost(data, user),
    onSuccess: () => {
      toast.success("Post submitted successfully");
      setPreviewUrl(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Submission failed");
    },
  });

  //validate image first if it already exists or not
  const validateImage = (fileList: FileList) => {
    if (!fileList || fileList.length === 0) {
      return "Image is required";
    }

    const file = fileList[0];
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed";
    }

    return true;
  };

  //handle Image Change when uploaded
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //It will target the files store on the input button who calls this
    const files = e.target.files;

    //Check if theres an image
    if (files && files.length > 0) {
      const file = files[0];

      // Clear previous preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      //Create URL and to find it
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Manually set the value and trigger validation
      setValue("image", files, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      // Handle case when no file is selected (user cancels file dialog)
      setPreviewUrl(null);
      setValue("image", null as any, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  //On submit , it will mutate, and use the function created earlier
  const onSubmit = (data: FormData) => {
    if (!user) {
      toast.error("You must be logged in to submit a post.");
      return;
    }
    mutate({ data, user });
  };

  // Register the image field manually with validation
  React.useEffect(() => {
    register("image", {
      required: "Image is required",
      validate: validateImage,
    });
  }, [register]);

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-xl mx-auto p-6 bg-[#FBE9E7] rounded-xl shadow-md space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-[#4CAF50]">
        Create a Post
      </h2>

      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-auto max-h-64 object-cover rounded-md mt-2 border"
          />
        ) : (
          <div className="w-full flex justify-center">
            <Image size={64} />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-800">Title</label>
        <input
          type="text"
          placeholder="What's on your mind?"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters long",
            },
            maxLength: {
              value: 100,
              message: "Title must be less than 100 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9\s\-_.,!?]+$/,
              message: "Title contains invalid characters",
            },
          })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4CAF50] focus:border-[#4CAF50]"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-800">Content</label>
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
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
      {/* File Upload - Icon Only */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="image"
          className="flex flex-row gap-4 cursor-pointer text-[#4CAF50] hover:text-green-700 transition"
          title="Upload Image"
        >
          <span>
            <File size={24} />
          </span>
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex flex-row justify-center">
        <Button
          type="submit"
          variant="default"
          width="long"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};
