import express from "express"
import { getAllAuthors, getMyProfile, login, logout, register } from "../controllers/userController.js"
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router()
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getMyProfile", isAuthenticated, getMyProfile);
router.get("/authors", getAllAuthors)
export default router;