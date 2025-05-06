import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterNewUserMutation } from "../app/api/usersApiSlice";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import chatAnimation from "../img/chat.json";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const NAME_REGEX = /^[A-z]{2,20}$/;

const Register = () => {
  const [registerNewUser, { isLoading, isSuccess, isError, error }] =
    useRegisterNewUserMutation();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles] = useState(["User"]);

  useEffect(() => setValidUsername(USER_REGEX.test(username)), [username]);
  useEffect(() => setValidPassword(PWD_REGEX.test(password)), [password]);
  useEffect(() => setValidFirstName(NAME_REGEX.test(firstName)), [firstName]);
  useEffect(() => setValidLastName(NAME_REGEX.test(lastName)), [lastName]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const canSave =
    [
      roles.length,
      validUsername,
      validPassword,
      validFirstName,
      validLastName,
    ].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      const fullname = `${firstName} ${lastName}`.trim();
      try {
        await registerNewUser({ fullname, username, password, roles });
      } catch (err) {
        console.error("Registration failed:", err);
      }
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#f9fafe]">
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

      {/* Left Panel */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-pink-500 to-purple-600 text-white px-6 py-10 sm:px-10">
        <Lottie
          animationData={chatAnimation}
          loop
          className="w-48 h-48 sm:w-64 sm:h-64 mb-6"
        />
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-600 mb-4 text-center"
        >
          Nhiều Chuyện
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg text-center max-w-xs sm:max-w-md"
        >
          Tạo tài khoản để không bỏ lỡ những cuộc trò chuyện thú vị!
        </motion.p>
      </div>

      {/* Right Panel */}
      <div className="z-10 w-full md:w-1/2 flex items-center justify-center px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md sm:max-w-lg bg-white/60 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>
          <p
            className={
              isError ? "text-red-500 text-sm text-center mb-4" : "sr-only"
            }
          >
            {error?.data?.message}
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                id="firstname"
                value={firstName}
                onChange={setFirstName}
                isValid={validFirstName}
              />
              <InputField
                label="Last Name"
                id="lastname"
                value={lastName}
                onChange={setLastName}
                isValid={validLastName}
              />
            </div>
            <InputField
              label="Username"
              id="username"
              value={username}
              onChange={setUsername}
              isValid={validUsername}
              hint="[3-20 letters]"
            />
            <InputField
              label="Password"
              id="password"
              value={password}
              onChange={setPassword}
              isValid={validPassword}
              type="password"
              hint="[4-12 characters incl. !@#$%]"
            />
            <button
              type="submit"
              disabled={!canSave}
              className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              Register
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

const InputField = ({
  label,
  id,
  value,
  onChange,
  isValid,
  type = "text",
  hint,
}) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-gray-700 font-medium">
      {label} {hint && <span className="text-sm text-gray-400">{hint}</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition ${
        isValid ? "shadow-inner" : ""
      }`}
      required
    />
  </div>
);

export default Register;
