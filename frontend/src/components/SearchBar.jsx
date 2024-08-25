import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import axios from "axios";
import { X } from "lucide-react";
import { setSearchUser } from "@/redux/authSlice";
import { Link } from "react-router-dom";
const SearchBar = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.auth.searchUser);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(" user not found");

  const getSearchUsers = async () => {
    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/user/getsearchusers?name=${search}`,
        { withCredentials: true }
      );

      if (search == "") {
        dispatch(setSearchUser([]));
      }

      if (res.data.success && search !== "") {
        dispatch(setSearchUser(res.data.users));
      }
    } catch (err) {
      setError(err.response.data.message);
      dispatch(setSearchUser([]));
    }
  };

  useEffect(() => {
    getSearchUsers();
  }, [search]);

  const handleClose = () => {
    setOpen(false);
    dispatch(setSearchUser([]));
  };

  return (
    <Sheet open={open}>
      <SheetContent onInteractOutside={handleClose} side="left">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Search for Users</SheetTitle>
            <X onClick={handleClose} className="cursor-pointer" />
          </div>
        </SheetHeader>
        <div className="my-3">
          <Input
            placeholder="Search users..."
            className=""
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="my-3">
          {searchResults?.length > 0 ? (
            searchResults?.map((user) => (
              <Link
                to={`/profile/${user?._id}`}
                key={user._id}
                className="flex items-center gap-4 p-2"
              >
                <img
                  src={user?.profilePicture}
                  alt={user?.userName}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{user?.userName}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">{error}</p>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
