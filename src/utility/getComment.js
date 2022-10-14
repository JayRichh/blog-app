import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const getComments = async (blogId) => {
  const docRef = doc(db, "blogs", blogId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().comments;
  }

  return docSnap.data().comments.map((comment) => ({
    ...comment,
    timestamp: comment.timestamp.toDate(),
  }));
};

export default getComments;
