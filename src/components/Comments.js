import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import addComment from "../utility/addComment";
import getComments from "../utility/getComment";

const Comments = ({ blogId, user }) => {
  // comments section for the blod, including display of comments and adding comments to the blog
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // import Random User Generator API
  const handleComment = async (e) => {
    e.preventDefault();
    if (comment) {
      await addComment(blogId, user, comment);
      setComment("");
    } else {
      return toast.error("Comment cannot be empty");
    }
  };

  const getCommentsFromDB = async () => {
    const commentRef = collection(db, "comments");  
    const commentQuery = query(commentRef, where("blogId", "==", blogId)); 
    const commentSnapshot = await getDocs(commentQuery);
    let comments = [];
    commentSnapshot.forEach((doc) => {
      comments.push({id: doc.id, ...doc.data()});
    });
    setComments(comments);
  };

  const deleteComment = async (id) => { 
    // delete comment from the database and update the UI accordingly
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteDoc(doc(db, "comments", id));
      toast.success("Comment deleted successfully"); 
    }
  };

  const handleCommentDelete = async (id) => {
    if (user?.uid) {
      await deleteComment(id);
      getCommentsFromDB();
    } else {
      return navigate("/auth");
    }
  };

  // get comments from DB
  useEffect(() => {
    getCommentsFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="comments">
      <h3>Comments</h3>
      {user ? (
        <form onSubmit={handleComment}>
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <p>
          <span
            onClick={() => navigate("/auth")}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Login
          </span>{" "}
          to add a comment
        </p>
      )}
      <div className="comment-list">
        {comments.map((comment) => (
          <div
            className="comment"
            key={comment.id}
            style={{ border: "1px solid" }}
          >
            <div className="comment-user">
              <img
                src="https://xsgames.co/randomusers/avatar.php?g=male"
                alt={""}
              />
              <p>{comment.name}</p>
              <p>{comment.timestamp.toDate().toDateString()}</p>
            </div>
            <div className="comment-content">
              <p>{comment.comment}</p>
              <div className="comment-actions">
                {user?.uid === comment.userId && (
                  <i
                    className="fas fa-trash"
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Delete
                  </i>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
