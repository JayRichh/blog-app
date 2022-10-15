import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import Trending from "../components/Trending";

const Home = ({ setActive, user }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogs);
  };

  useEffect(() => {
    getTrendingBlogs();
    const unsub = onSnapshot(
      // onSnapshot is a listener that listens for changes in the database and updates the UI accordingly
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          // docs is an array of all the documents in the collection
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);

        const filterBlogs = (blogs) => {
          // filterBlogs is a function that filters the blogs based on the search term entered by the user
          if (searchTerm === "") {
            return blogs;
          } else {
            console.log(blogs);
            return blogs.filter((blog) => {
              // if the blog title or description includes the search term, return the blog
              return (
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                blog.tags.includes(searchTerm.toLowerCase())
              );
            });
          }
        };

        setBlogs(filterBlogs(list));

        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getTrendingBlogs();
    };
  }, [setActive, searchTerm]);

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <div className="row">
            <div className="col-md-12">
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Blogs..."
                  aria-label="Search Blogs..."
                  aria-describedby="basic-addon2"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Trending blogs={trendBlogs} />
          <div className="col-md-8">
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
            />
          </div>
          <div className="col-md-4">
            <Tags
              tags={tags}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
            <MostPopular blogs={blogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
