import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function JobSeekerRoute({ children }) {

    const { user } = useSelector(
        (state) => state.auth
    );

    if (user?.role !== "jobseeker") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default JobSeekerRoute;