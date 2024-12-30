import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }: any) => {
  const navigate = useNavigate();
  const blogPage = (blogId: any) => {
    navigate(`/blog/${blogId}`);
  };
  return (
    <div
      className="max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow  w-full sm:w-sm text-white/80 cursor-pointer"
      onClick={() => blogPage(blog.id)}
    >
      {blog.author.name}
      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">
        {blog.title}
      </h5>
      <p className="mb-3 font-normal text-gray-500 ">
        {blog.content.slice(0, 100) + "..."}
      </p>
    </div>
  );
};

export default BlogCard;
