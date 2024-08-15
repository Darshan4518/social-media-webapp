import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import DragDropUpload from "./DragAndDrop";
import { CssBaseline, Container, Typography } from "@mui/material";

const CreatePost = ({ open, setOpen }) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="p-3 max-w-4xl "
        >
          <div className="bg-gray-100  p-3">
            <CssBaseline />
            <Container>
              <DragDropUpload />
            </Container>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
