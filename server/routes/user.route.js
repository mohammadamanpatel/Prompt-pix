import express from "express";
import {
  deleteUser,
  updateUser,
  getUser,
  getUsers,
  deleteUserForAdmin,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../utils/uploadByMulter.js";

const router = express.Router();

router.post("/update/:id", verifyToken, upload.single("avatar"), updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.delete("/deleteForAdmin/:id", verifyToken, deleteUserForAdmin);
router.get("/:id", verifyToken, getUser);
router.get("/", verifyToken, getUsers);

export default router;
