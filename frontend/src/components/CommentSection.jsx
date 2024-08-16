import React from "react";

const CommentSection = ({ addComment, text, setComment }) => {
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setComment(inputText);
    } else {
      setComment("");
    }
  };
  return (
    <div className="p-2 flex justify-between items-center">
      <input
        type="text"
        value={text}
        placeholder="Add a comment..."
        className="border-none outline-none flex-grow"
        onChange={changeEventHandler}
      />
      {text && (
        <span className="text-blue-500 cursor-pointer" onClick={addComment}>
          Post
        </span>
      )}
    </div>
  );
};

export default CommentSection;
