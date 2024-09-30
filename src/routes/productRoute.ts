
import express, {Router} from "express"
import AuthMiddleware, { Role } from "../middleware/middleware"
import {multer,storage} from "../middleware/multerMiddleware"
import ProductController from "../controllers/productController"
import errorHandler from "../services/catchAsyncError"

const router:Router=express.Router()
const upload = multer({storage:storage})
router.route("/").post(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),upload.single("image"),ProductController.addProduct)




export default router