import { login } from "../services/auth.service.js";
import { loginSuccess } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { emailValidation, passwordValidation } from "../utils/validation";

function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
        const response = await login(data);

        dispatch(
            loginSuccess(response.data.user)
        );

        toast.success(response.message);

        if (response.data.user.role === "recruiter") {

            navigate("/recruiter/dashboard");

        }
        else {

            navigate("/");

        }
    }
    catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Login Failed"
        );
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Login
        </h1>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email", emailValidation)}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-gray-700"
          >
            Password
          </label>

          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", passwordValidation)}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
