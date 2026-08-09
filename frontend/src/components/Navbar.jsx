import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../services/auth.service.js";
import { logoutSuccess } from "../features/auth/authSlice.js";
import { useSelector } from "react-redux";
import Profile from "../pages/profile/Profile";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(user);

  const handleLogout = async () => {
    try {
      const response = await logout();

      toast.success(response.message);
    } catch (error) {
      console.log(error);

      toast.error("Session expired. Please login again.");
    } finally {
      dispatch(logoutSuccess());

      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>

          <div className="flex items-center gap-6">
            <Link to="/">Home</Link>

            {isAuthenticated && user?.role === "recruiter" && (
              <Link to="/recruiter/dashboard">Dashboard</Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>

                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                {user?.role === "jobseeker" && (
                  <>
                    <Link to="/my-applications">My Applications</Link>

                    <Link to="/profile">Profile</Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
