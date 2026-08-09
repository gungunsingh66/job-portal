import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { getCurrentUser, refreshAccessToken } from "./services/auth.service";
import { loginSuccess, authCheckComplete } from "./features/auth/authSlice.js";

function App() {
  const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await getCurrentUser();

//         dispatch(loginSuccess(response.data));
//       } catch (error) {
//         dispatch(authCheckComplete());

//         console.log(error);
//       }
//     };

//     fetchCurrentUser();
//   }, [dispatch]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        let response;

        try {
          // First try existing access token
          response = await getCurrentUser();
        } catch (error) {
          // Access token may be expired
          if (error.response?.status === 401) {
            // Try refreshing it ONCE
            await refreshAccessToken();

            // Try current-user again
            response = await getCurrentUser();
          } else {
            throw error;
          }
        }

        dispatch(loginSuccess(response.data));
      } catch (error) {
        console.log("No active session");

        dispatch(authCheckComplete());
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
