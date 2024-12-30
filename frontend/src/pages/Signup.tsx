import { SignupInput } from "@sidd9101/medium-common";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
const Signup = () => {
  const [signupInputs, setSignupInputs] = useState<SignupInput>({
    email: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        signupInputs
      );
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      setLoading(false);
      navigate("/home");
      toast.success("Signed up!");
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
      toast.error(`${error.response.data.message}`);
    }
  };

  useEffect(() => {
    const token = localStorage?.getItem("token") || null;
    if (token) {
      navigate("/home");
    }
  }, []);
  return (
    <div className="h-screen p-5 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center border rounded-md p-8">
        <h1 className="text-3xl font-bold  text-center mb-1">Join Medium</h1>
        <p className=" text-sm mb-5">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="underline  inline-flex justify-center items-center gap-1 ml-1"
          >
            Signin <FaExternalLinkAlt className="text-xs" />
          </Link>{" "}
        </p>
        <form className="max-w-sm mx-auto" onSubmit={handleSignup}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="name@email.com"
              required
              value={signupInputs.email}
              onChange={(e) =>
                setSignupInputs({
                  ...signupInputs,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="John Doe"
              required
              value={signupInputs.name}
              onChange={(e) =>
                setSignupInputs({
                  ...signupInputs,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              value={signupInputs.password}
              onChange={(e) =>
                setSignupInputs({
                  ...signupInputs,
                  password: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {loading ? <Spinner /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
