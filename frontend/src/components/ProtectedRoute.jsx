import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const {
        isAuthenticated,
        authLoading,
    } = useSelector((state) => state.auth);

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;