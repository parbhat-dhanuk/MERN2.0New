
import {Request,Response} from "express"
import Product from "../database/models/productModel"



class ProductController{

    async addProduct(req:Request,res:Response):Promise<void>{

     const {productName,productDescription,productPrice,productTotalStockQty}=req.body
     let fileName
     if(req.file){
        fileName=req.file?.filename
     }else{
        fileName="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww"
     }

     if(!productName||!productDescription||!productPrice||!productTotalStockQty){
        res.status(400).json({
            message:"please provide ProductName,productDescription,productPrice,productTotalStockQty"
        })
        return
     }

     Product.create({
        productName,
        productPrice,
        productDescription,
        productTotalStockQty,
        productImageUrl:fileName 
     })
     res.status(200).json({
      message:"product added successfully"
     })

    }
}

export default new ProductController()