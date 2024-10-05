import {Response} from "express"
import { AuthRequest } from "../middleware/middleware"
import Cart from "../database/models/cart"
import Product from "../database/models/productModel"

class CartController{

    async addToCart(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const {quantity,productId}=req.body
        if(!quantity||!productId){
            res.status(400).json({
                message:"please provide quantity and productId"
            })
        }
        //check if the product already exists in the cart table or not

        let cartItem=await Cart.findOne({  //findOne le chai object return garxa.
            where:{
                productId:productId,
                userId:userId
            }
        })
        if(cartItem){
            cartItem.quantity+=quantity //1 lekda +1 badxa but hami le amazon ko jasto banako xau. 
           await cartItem.save()        // mathi findOne ma findAll garepaxi array return garxa ra cartItem ma chai
           res.status(200).json({
            message:" added to cart successfully"
           })                             // cartItem[0].quantity+=quantity garnu parxa.
        }else{
            // Insert into cart
           const items= await Cart.create({
                quantity,
                userId,
                productId
            })
            res.status(200).json({
                message:"product added to cart",
                data:items
            })
        }
    }

    //Get cartItems

    async getMyCarts(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        const cartItems=await Cart.findAll({
            where:{
                userId:userId
            },
           
            include:[
                {
                    model:Product
                }
            ]
        })
        if(cartItems.length===0){
            res.status(400).json({
                message:"no items in the cart"
            })
        }else{
            res.status(200).json({
                message:"cart items fetched succesfully",
                data:cartItems
            })
        }
      
        
    }

}

export default new CartController()