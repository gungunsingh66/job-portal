import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import Application from "../models/application.model.js";
import { cookieOptions } from "../utils/cookieOptions.js";

// Generate Access & Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Generate Token Error:", error);
    throw error;
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  // Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }

  // Response
  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
        },
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged in successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: null,
        },
        "Access token refreshed successfully",
      ),
    );
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete old resume from Cloudinary if it exists
  if (user.resume) {
    // const oldResumeUrl =
    //   typeof user.resume === "string" ? user.resume : user.resume.url;
    const oldResumeUrl = user.resume.url;

    const applicationUsingResume = await Application.findOne({
      applicant: user._id,
      resume: oldResumeUrl,
    });

    if (!applicationUsingResume && user.resume.publicId) {
      await cloudinary.uploader.destroy(user.resume.publicId, {
        resource_type: "image",
      });
    }

    // if (!applicationUsingResume) {
    //   let oldPublicId;

    //   if (typeof user.resume === "string") {
    //     const match = oldResumeUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);

    //     if (match) {
    //       oldPublicId = match[1].replace(/\.[^/.]+$/, "");
    //     }
    //   } else {
    //     oldPublicId = user.resume.publicId;
    //   }

    //   if (oldPublicId) {
    //     await cloudinary.uploader.destroy(oldPublicId, {
    //       resource_type: "image",
    //     });
    //   }
    // }
  }

  // Upload new resume
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "job-portal/resumes",
        resource_type: "image",
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(req.file.buffer);
  });

  // Save new resume information
  user.resume = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resume: user.resume,
      },
      "Resume uploaded successfully",
    ),
  );
});

const removeResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.resume) {
    throw new ApiError(404, "No resume found");
  }

  // Get the current resume URL
  // const resumeUrl =
  //   typeof user.resume === "string" ? user.resume : user.resume.url;

  const resumeUrl = user.resume.url;

  // Check whether this resume was submitted with an application
  const applicationUsingResume = await Application.findOne({
    applicant: user._id,
    resume: resumeUrl,
  });

  // Delete from Cloudinary only if no application uses it
  // if (!applicationUsingResume) {
  //   let publicId;

  //   if (typeof user.resume === "string") {
  //     const match = resumeUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);

  //     if (match) {
  //       publicId = match[1].replace(/\.[^/.]+$/, "");
  //     }
  //   } else {
  //     publicId = user.resume.publicId;
  //   }
  if (!applicationUsingResume && user.resume.publicId) {
    await cloudinary.uploader.destroy(user.resume.publicId, {
      resource_type: "image",
    });
  }
  //   if (publicId) {
  //     await cloudinary.uploader.destroy(publicId, {
  //       resource_type: "image",
  //     });
  //   }
  // }

  // Remove resume from user's profile
  user.resume = undefined;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resume: null,
      },
      "Resume removed successfully",
    ),
  );
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  uploadResume,
  removeResume,
};
