import User from "../models/user.model.js";
import fs from "fs";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log("userId,req.params.id", userId, req.params.id);
    console.log("req.body", req.body);
    const { username, email } = req.body;

    // Check if the user ID from the request matches the authenticated user's ID
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Construct the update object based on provided fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    console.log("req.file", req.file);
    // Check if a file was uploaded
    if (req.file) {
      const avatarPath = req.file.path;

      // Upload the avatar image to Cloudinary
      const cloudinaryResponse = await uploadImageToCloudinary(
        avatarPath,
        "avatars"
      );
      console.log("cloudinaryResponse", cloudinaryResponse);
      // Update avatar details in the updateFields object with Cloudinary response
      updateFields.avatar = {
        public_id: cloudinaryResponse.public_id,
        secure_url: cloudinaryResponse.secure_url,
      };

      // Delete the file from the local filesystem
      fs.rm(avatarPath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("Local file deleted");
        }
      });
    }

    // Update the user in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    // Check if the user was found and updated
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user object
    res.status(200).json({ user });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res, next) => {
  console.log( req.params.id,"delete");
  
  if (req.user.id !== req.params.id)
    return res.json({
      message: "unable to delete account",
    });
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log("user deleted", user);
    res.clearCookie("JwtToken");
    res.status(200).json({
      success: true,
      message: "User has been deleted!",
    });
  } catch (error) {
    console.log("error in user Deletion", error);
    return res.json({
      error: error,
    });
  }
};
export const deleteUserForAdmin = async (req, res, next) => {
  console.log( req.params.id,"delete");
  if(!req.params.id){
    res.json({
      message:"unable to delete the user"
    })
  }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log("user deleted", user);
    res.clearCookie("JwtToken");
    res.status(200).json({
      success: true,
      message: "User has been deleted!",
    });
  } catch (error) {
    console.log("error in user Deletion", error);
    return res.json({
      error: error,
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user fetched", user);
    if (!user)
      return res.json({
        message: "user not found",
      });
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};
export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.id) {
      res.status(404).json({
        message: "Route is unreachable",
      });
    }
    // if(!req.user.isAdmin){
    //   res.status(400).json({
    //     message:"You sont have access to this"
    //   })
    // }
    const users = await User.find({});
    users.map((user) => {
      user.password = null;
    });
    console.log("user fetched", users);
    res.status(200).json(users);
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};
