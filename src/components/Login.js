import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";
import useTitle from "../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  useTitle("Login");

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/chat");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current?.focus();
    }
  };

  const errClass = errMsg ? "text-red-500 text-sm mb-2 text-center" : "sr-only";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <PulseLoader color="#4F46E5" size={15} />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center animate-gradient">
      <section className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fade-in hover:scale-[1.01] transition-transform duration-300 border border-white/40">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl text-white font-bold text-center drop-shadow mb-2"
        >
          ✨ Nhiều Chuyện
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-white/80 italic mb-6"
        >
          Nơi tám chuyện mọi lúc, mọi nơi
        </motion.p>

        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-medium text-white"
            >
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded p-2 focus-within:ring focus-within:border-blue-500 bg-white/70">
              <FaUserAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                id="username"
                ref={userRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-white"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded p-2 focus-within:ring focus-within:border-blue-500 bg-white/70">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="persist"
              checked={persist}
              onChange={() => setPersist((prev) => !prev)}
              className="h-4 w-4"
            />
            <label htmlFor="persist" className="text-sm text-white">
              Trust this device
            </label>
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="relative group overflow-hidden w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute left-0 top-0 h-full w-full bg-white opacity-10 group-hover:animate-ping"></span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="w-full bg-white/80 text-gray-800 px-4 py-2 rounded-xl hover:bg-white transition"
            >
              Create Account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
