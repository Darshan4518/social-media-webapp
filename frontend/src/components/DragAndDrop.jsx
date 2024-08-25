// DragDropUpload.jsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Typography, IconButton, TextField, Button } from "@mui/material";
import clsx from "clsx";
import { RxCross1 } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GrLinkPrevious } from "react-icons/gr";
import { Textarea } from "./ui/textarea";
import axios from "axios";

const DragDropUpload = ({ setOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [showCaptionInput, setShowCaptionInput] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg",
  });

  const handleImageRemove = () => {
    setSelectedImage(null);
    setShowCaptionInput(false);
    setCaption("");
  };

  const handleNextClick = () => {
    setShowCaptionInput(true);
  };

  const handlePreviousClick = () => {
    setShowCaptionInput(false);
  };

  const handlePostClick = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("caption", caption);

    try {
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setOpen(false);
      handleImageRemove();
    } catch (error) {
      console.error("Error posting the image:", error);
    }
  };

  return (
    <div className="max-w-full mt-2">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-400",
          { hidden: selectedImage }
        )}
      >
        <input {...getInputProps()} />
        <Typography variant="body1" className="text-center text-gray-600">
          Drag & drop an image here, or click to select one
        </Typography>
      </div>
      {selectedImage && !showCaptionInput && (
        <div className="relative my-4 ">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-auto max-h-[400px]  rounded-lg  mx-auto"
          />
          <div className="absolute top-0 right-0 rounded-full  hover:bg-gray-100   shadow-md bg-white">
            <IconButton onClick={handleImageRemove} className="">
              <RxCross1 className="text-red-500" />
            </IconButton>
          </div>
          <Button
            variant="ghost"
            className=" float-right"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      )}
      {showCaptionInput && (
        <div className="">
          <div className=" flex justify-between my-2">
            <Button variant="ghost" onClick={handlePreviousClick}>
              <GrLinkPrevious size={22} />
            </Button>
            <div>Create a new post</div>
            <Button variant="ghost" onClick={handlePostClick}>
              Post
            </Button>
          </div>
          <div className="flex">
            <div className=" w-[70%] ">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className=" w-auto h-[400px] rounded-lg m-auto"
              />
            </div>
            <div className=" max-w-[30%] ml-4 flex flex-col space-y-2">
              <div className="flex gap-x-2 items-center">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-base lg:text-lg">User name</p>
              </div>

              <Textarea
                placeholder="Write a caption "
                value={caption}
                className=" bg-transparent resize-none overflow-y-hidden w-[250px] h-[200px]"
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
