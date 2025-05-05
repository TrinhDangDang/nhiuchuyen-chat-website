// --- Modernized Register.js with Tailwind CSS ---
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterNewUserMutation } from "../features/users/usersApiSlice";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <section className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>
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
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Register;
