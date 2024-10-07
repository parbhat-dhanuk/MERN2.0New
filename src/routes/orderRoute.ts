import express,{Router} from "express"
import AuthMiddleware from "../middleware/middleware"
import errorHandler from "../services/catchAsyncError"
import orderController from "../controllers/orderController"

const router:Router=express.Router()

router.route("/").post(AuthMiddleware.isAuthenticated,errorHandler(orderController.createOrder))


export default router