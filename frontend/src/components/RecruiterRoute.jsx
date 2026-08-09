import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RecruiterRoute({ children }) {

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "recruiter") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RecruiterRoute;