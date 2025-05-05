// --- Updated Login.js with Tailwind CSS ---
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";
import useTitle from "../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

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

  const errClass = errMsg ? "text-red-500 text-sm mb-2" : "sr-only";

  if (isLoading) return <PulseLoader color="#000" />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
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
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
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

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
