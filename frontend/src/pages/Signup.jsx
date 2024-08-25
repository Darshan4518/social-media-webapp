import React, { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
const Signup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  if (user) {
    navigate("/");
  }
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const inputFieldHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "https://instagram-olwk.onrender.com/api/v1/user/register",
        input
      );
      if (res.status === 201) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          userName: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
          Get started today
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
          sunt dolores deleniti inventore quaerat mollitia?
        </p>

        <form
          onSubmit={formHandler}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Sign up to your account
          </p>
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>

            <div className="relative">
              <input
                type="text"
                name="userName"
                value={input.userName}
                onChange={inputFieldHandler}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter username"
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4 text-slate-500">
                <FaRegUser size={20} />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={inputFieldHandler}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4 text-slate-500">
                <MdOutlineAlternateEmail size={22} />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                type={passwordType ? "password" : "text"}
                name="password"
                value={input.password}
                onChange={inputFieldHandler}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4 text-slate-500">
                {passwordType ? (
                  <MdOutlineRemoveRedEye
                    size={22}
                    onClick={() => setPasswordType(!passwordType)}
                  />
                ) : (
                  <FaEyeSlash
                    size={22}
                    onClick={() => setPasswordType(!passwordType)}
                  />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have a account?
            <Link
              className="underline  text-blue-500 font-semibold"
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
