import { IoIosLogOut } from "react-icons/io";
import { GiQuillInk } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { jwtDecode } from "jwt-decode";
import Skeleton from "../components/Skeleton";
import BlogCard from "../components/BlogCard";
import toast from "react-hot-toast";

type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: { name: string; id: string };
  authorId: string;
};
const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<[Post]>();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  useEffect(() => {
    const token = localStorage?.getItem("token") || "";
    if (token === "") {
      navigate("/signin");
    }

    const payload = jwtDecode(token);
    //@ts-ignore
    setName(payload.name);
    try {
      setLoading(true);
      axios
        .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data.posts);
          setPosts(response.data.posts);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="h-auto">
      {/* Navbar */}
      <nav className="bg-white border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              <span className="text-xl">Hello,</span> {name} 👋
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
              onClick={() => navigate("/compose")}
            >
              <span className="inline-flex justify-center items-center gap-3">
                <span className="hidden md:block">Write</span> <GiQuillInk />{" "}
              </span>
            </button>
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              aria-controls="navbar-cta"
              aria-expanded="false"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/signin");
                toast.success("Logged out!");
              }}
            >
              <IoIosLogOut className="size-5" />
            </button>
          </div>
        </div>
      </nav>
      {/* Blogs */}

      {loading ? (
        <div className="flex flex-col gap-3 px-5">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-3 px-5">
          {posts?.map((post, idx) => (
            <BlogCard key={idx} blog={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
