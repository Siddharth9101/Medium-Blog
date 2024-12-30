import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../config";

const Blog = () => {
  const blogId = useParams().id || "";
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
  });
  useEffect(() => {
    try {
      axios
        .get(`${BACKEND_URL}/api/v1/blog/get/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setBlog({
            title: response.data.post.title,
            content: response.data.post.content,
            author: response.data.post.author.name,
          });
        });
    } catch (error) {}
  }, []);
  return (
    <>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white antialiased h-screen">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue ">
            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 te">
                  <div>
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-bold text-gray-900 "
                    >
                      {blog.author}
                    </a>
                  </div>
                </div>
              </address>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl ">
                {blog.title}
              </h1>
            </header>
            <p className="lead">{blog.content}</p>
          </article>
        </div>
      </main>
    </>
  );
};

export default Blog;
