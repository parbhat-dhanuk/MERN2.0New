import express, { Router } from "express"
const router:Router = express.Router()
import AuthMiddleware from "../middleware/middleware"
import cartController from "../controllers/cartController"

router.route("/").post(AuthMiddleware.isAuthenticated,cartController.addToCart)
.get(AuthMiddleware.isAuthenticated,cartController.getMyCarts)

export default router