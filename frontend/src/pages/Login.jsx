import React, { useState, useEffect } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // UseEffect to navigate after component renders
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const inputFieldHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://social-media-webapp-2z2m.onrender.com/api/v1/user/login",
        input,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
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
            Sign In to your account
          </p>

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

          {loading ? (
            <button
              type="button"
              disabled={loading}
              className=" w-full rounded-lg flex justify-center bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              <Loader2 className=" animate-spin" />
            </button>
          ) : (
            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Login
            </button>
          )}

          <p className="text-center text-sm text-gray-500">
            Create a new account?{" "}
            <Link
              className="underline text-blue-500 font-semibold"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
