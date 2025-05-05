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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f9fafe]">
      {/* Left: Branding */}
      <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-pink-500 to-purple-600 text-white p-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-center mb-4"
        >
          ✨ Nhiều Chuyện
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-center max-w-md"
        >
          Đăng ký để bắt đầu cuộc trò chuyện thú vị với cộng đồng!
        </motion.p>

        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Right: Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-xl bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create Your Account
          </h2>
          <p className={errClass}>{error?.data?.message}</p>

          <form onSubmit={onSaveUserClicked} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block mb-1 text-gray-700 font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="off"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                    validFirstName ? "border-green-400" : "border-red-400"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block mb-1 text-gray-700 font-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="off"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                    validLastName ? "border-green-400" : "border-red-400"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-gray-700 font-medium"
              >
                Username{" "}
                <span className="text-sm text-gray-400">[3-20 letters]</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                  validUsername ? "border-green-400" : "border-red-400"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-gray-700 font-medium"
              >
                Password{" "}
                <span className="text-sm text-gray-400">
                  [4-12 chars incl. !@#$%]
                </span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                  validPassword ? "border-green-400" : "border-red-400"
                }`}
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!canSave}
                className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                Register
              </button>
            </div>

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
        </div>
      </div>
    </main>
  );
};

export default Register;
