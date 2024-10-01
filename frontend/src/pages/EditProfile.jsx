import React, { useState, useCallback } from "react";
import MainLayout from "./MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "");

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      bio,
      gender,
      ...(selectedFile && { profilePicture: selectedFile }),
    };

    try {
      setLoader(true);
      const formData = new FormData();
      Object.entries(updatedUser).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.put(
        "http://localhost:5000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        dispatch(setAuthUser(res.data.user));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoader(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <MainLayout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%] p-3"
      >
        <h2 className="text-2xl font-bold my-3">Edit Profile</h2>
        <div className="p-4 bg-slate-200 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] flex flex-col sm:flex-row items-center justify-between rounded-2xl">
          <div className="flex items-center gap-x-4 mb-4 sm:mb-0">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>
                {user?.userName?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user?.userName}</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-x-4">
            <Button {...getRootProps()}>Change Photo</Button>
            <input {...getInputProps()} />
          </div>
        </div>
        <div className="my-3">
          <h2 className="text-lg font-semibold text-gray-700 my-3">Website</h2>
          <div className="p-3 bg-slate-200 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] flex items-center justify-between rounded-2xl font-semibold">
            Website
          </div>
          <p className="text-gray-600 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] my-3">
            Editing your links is only available on mobile. Visit the Instagram
            app and edit your profile to change the websites in your bio.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 my-3">Bio</h2>
          <Textarea
            className="resize-none w-full sm:w-[90%] md:w-[80%] lg:w-[60%] overflow-y-scroll"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 my-3">Gender</h2>
          <TextField
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%]"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </div>
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%] my-10">
          {loader ? (
            <Button type="button" disabled={loader} className="float-right">
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button type="submit" className="float-right">
              Submit
            </Button>
          )}
        </div>
      </form>
    </MainLayout>
  );
};

export default EditProfile;
