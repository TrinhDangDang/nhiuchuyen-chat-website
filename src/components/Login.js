import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import chatAnimation from "../img/chat.json";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Login = () => {
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

  const errClass = errMsg ? "text-red-500 text-sm mb-4 text-center" : "sr-only";

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <PulseLoader color="#4F46E5" size={15} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row bg-[#f9fafe] overflow-hidden">
      <Particles
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: "#f9fafe" },
          particles: {
            number: { value: 60 },
            size: { value: 2 },
            move: { speed: 0.5 },
            color: { value: "#8b5cf6" },
            links: { enable: true, color: "#c084fc", distance: 150 },
          },
        }}
      />

      {/* Left: Branding + Lottie */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-500 text-white p-10">
        <Lottie animationData={chatAnimation} loop className="w-72 h-72 mb-6" />
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-600 mb-4"
        >
          Nhiều Chuyện
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-center max-w-md"
        >
          Chill chat, vui cực!
        </motion.p>
      </div>

      {/* Right: Form */}
      <div className="z-10 w-full md:w-1/2 flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-xl shadow-xl p-8 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                ref={userRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="persist"
                checked={persist}
                onChange={() => setPersist((prev) => !prev)}
                className="h-4 w-4"
              />
              <label htmlFor="persist" className="text-sm text-gray-600">
                Trust this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-all"
            >
              Sign In
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/create")}
                  className="text-indigo-600 hover:underline"
                >
                  Create one
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
