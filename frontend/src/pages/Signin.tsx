import { useEffect, useState } from "react";
import { SigninInput } from "@sidd9101/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { FaExternalLinkAlt } from "react-icons/fa";

const Signin = () => {
  const [signinInputs, setSigninInputs] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        signinInputs
      );
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      setTimeout(() => {
        setLoading(false);
        toast.success("Logged in!");
        navigate("/home");
      }, 1500);
      setSigninInputs({
        email: "",
        password: "",
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error("Something went wrong!");
      setSigninInputs({
        email: "",
        password: "",
      });
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
      <div className="flex flex-col mb-4 justify-center items-center border rounded-md p-8">
        <h1 className="text-3xl font-bold text-center mb-1">Welcome back.</h1>
        <p className=" text-sm mb-5">
          Not registered yet?{" "}
          <Link
            to="/signup"
            className="underline inline-flex justify-center items-center gap-1 ml-1"
          >
            Signup <FaExternalLinkAlt className="text-xs" />
          </Link>{" "}
        </p>
        <form className="max-w-sm mx-auto" onSubmit={handleSignin}>
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
              value={signinInputs.email}
              onChange={(e) =>
                setSigninInputs({
                  ...signinInputs,
                  email: e.target.value,
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
              value={signinInputs.password}
              onChange={(e) =>
                setSigninInputs({
                  ...signinInputs,
                  password: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {loading ? <Spinner /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
