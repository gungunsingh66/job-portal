import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register as registerUser } from "../services/auth.service.js";

import { emailValidation, passwordValidation } from "../utils/validation.js";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);

      toast.success(response.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Create Account
        </h1>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            className="w-full border rounded-lg px-4 py-2"
            {...register("name", {
              required: "Name is required",
            })}
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-4 py-2"
            {...register("email", emailValidation)}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            id="password"
            placeholder="Enter password"
            className="w-full border rounded-lg px-4 py-2"
            {...register("password", passwordValidation)}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Register As</label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" value="jobseeker" {...register("role")} />
              Job Seeker
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" value="recruiter" {...register("role")} />
              Recruiter
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
