import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const addComment = async (blogId, user, comment) => {
  const docRef = doc(db, "blogs", blogId);
  const docSnap = await getDoc(docRef);

  // create new comment id for each comment
  const newCommentId = docSnap.data().comments.length + 1;

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      comments: arrayUnion({
        id: newCommentId,
        name: user.displayName,
        comment: comment,
        timestamp: new Date(),
      }),
    });
  }
}

export default addComment;
