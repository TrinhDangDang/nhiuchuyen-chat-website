import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterNewUserMutation } from "../features/users/usersApiSlice";
import { motion } from "framer-motion";

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
  const [roles, setRoles] = useState(["User"]);

  useEffect(() => setValidUsername(USER_REGEX.test(username)), [username]);
  useEffect(() => setValidPassword(PWD_REGEX.test(password)), [password]);
  useEffect(() => setValidFirstName(NAME_REGEX.test(firstName)), [firstName]);
  useEffect(() => setValidLastName(NAME_REGEX.test(lastName)), [lastName]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
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

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        const fullname = `${firstName} ${lastName}`.trim();
        await registerNewUser({ fullname, username, password, roles });
      } catch (err) {
        console.error("Error creating user:", err);
      }
    }
  };

  const errClass = isError
    ? "text-red-500 text-sm mb-4 text-center"
    : "sr-only";

  return (
    <main className="min-h-screen flex items-center justify-center animate-gradient">
      <section className="w-full max-w-xl bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fade-in hover:scale-[1.01] transition-transform duration-300 border border-white/40">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-white text-center mb-2"
        >
          ✨ Đăng ký tài khoản
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/80 italic mb-6"
        >
          Chào mừng đến với Nhiều Chuyện!
        </motion.p>

        <p className={errClass}>{error?.data?.message}</p>

        <form onSubmit={onSaveUserClicked} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block mb-1 text-white font-medium"
              >
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="off"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring bg-white/70 text-gray-900 ${
                  validFirstName ? "border-green-400" : "border-red-400"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block mb-1 text-white font-medium"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring bg-white/70 text-gray-900 ${
                  validLastName ? "border-green-400" : "border-red-400"
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-white font-medium"
            >
              Username{" "}
              <span className="text-sm text-white/70">[3-20 letters]</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring bg-white/70 text-gray-900 ${
                validUsername ? "border-green-400" : "border-red-400"
              }`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-white font-medium"
            >
              Password{" "}
              <span className="text-sm text-white/70">
                [4-12 chars incl. !@#$%]
              </span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring bg-white/70 text-gray-900 ${
                validPassword ? "border-green-400" : "border-red-400"
              }`}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!canSave}
              className="relative group overflow-hidden w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              <span className="relative z-10">Register</span>
              <span className="absolute left-0 top-0 h-full w-full bg-white opacity-10 group-hover:animate-ping"></span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Register;
