import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import axios from "axios";
import { Loader, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "./ui/avatar";

const SearchBar = ({ open, setOpen }) => {
  const [search, setSearch] = useState("");

  const getSearchUsers = async () => {
    if (search.trim()) {
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/getsearchusers?name=${search}`,
        { withCredentials: true }
      );
      return res.data.users;
    }
    return [];
  };

  const { isLoading, data: searchResults } = useQuery({
    queryKey: ["getSearchUsers", search],
    queryFn: getSearchUsers,
    enabled: !!search,
  });

  const handleClose = () => {
    setOpen(false);
    setSearch("");
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader className="animate-spin size-10" />
          </div>
        ) : (
          <ScrollArea className="my-3">
            {searchResults?.length > 0 ? (
              searchResults?.map((user) => (
                <Link
                  to={`/profile/${user?._id}`}
                  key={user._id}
                  className="flex items-center gap-4 p-2"
                >
                  <Avatar
                    src={user?.profilePicture}
                    alt={user?.userName}
                    className="w-10 h-10 rounded-full"
                  >
                    <AvatarFallback className="uppercase">
                      {user?.userName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.userName}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">User not found...</p>
            )}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
