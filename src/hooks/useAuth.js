//userAuth hook hooks into the Redux store to get the token and decode it.
//gives you the current user's username and role (status)
//no need to manually decode the token or fetch the user everywhere. Just call the hook whenever you need this info

import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let status = "User";

  if (token) {
    const decoded = jwtDecode(token);
    const { userId, username, roles } = decoded.UserInfo;

    isAdmin = roles.includes("Admin");

    if (isAdmin) status = "Admin";

    return { userId, username, roles, status, isAdmin };
  }

  return { username: "", roles: [], isAdmin, status };
};
export default useAuth;
