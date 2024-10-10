
import {Request,Response} from "express"
import Product from "../database/models/productModel"
import { AuthRequest } from "../middleware/middleware"
import User from "../database/models/userModel"
import Category from "../database/models/category"
import fs from 'fs'
import path from "path"





class ProductController{

  
    async addProduct(req:AuthRequest,res:Response):Promise<void>{
        const userId=req.user?.id  // product ko foreignkey ko lagi id ho
     const {productName,productDescription,productPrice,productTotalStockQty,categoryId}=req.body
     let fileName
     if(req.file){
        fileName=req.file?.filename
     }else{
        fileName="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww"
     }

     if(!productName||!productDescription||!productPrice||!productTotalStockQty||!categoryId){
        res.status(400).json({
            message:"please provide ProductName,productDescription,productPrice,productTotalStockQty,categoryId"
        })
        return
     }

     Product.create({
        productName,
        productPrice,
        productDescription,
        productTotalStockQty,
        productImageUrl:fileName,
        userId:userId,
        categoryId:categoryId

        
     })
     res.status(200).json({
      message:"product added successfully"
     })

    }

    //Get All Products

    async getAllProducts(req:Request,res:Response):Promise<void>{
      const data = await Product.findAll(
         {                        //yo chai find gareko data ko sanga relation ma xa tesko(foreign key) data ni dinxa.
            include: [              //yedi relation na vako vate yo kura garna mildaina.      
               {
                  model:User,
                  attributes:["id","email","username"] //attributes ma chai k kura matar dine vanne kura ho.
               },

               {
                  model:Category,
                  attributes:["id", "categoryName"]
               }
            ]
         }
      )
      res.status(200).json({
         message:"Product fetched successfully",
         data:data
      })
    }
    

    //Get Single Product

    async getSingleProduct(req:Request,res:Response):Promise<void>{
      const id = req.params.id
      const data = await Product.findAll({
         where:{
            id:id
         },
         include:[
            {
               model:User,
               attributes:["id","email","username"]
            },
            {
               model:Category,
               attributes:["id","categoryName"]
            }
         ]
      })
      if(data.length===0){
         res.status(404).json({
            message:"no product with that id"
         })
      }else{
         res.status(200).json({
            message:"product fetched successfully",
            data:data
         })
      }
    }

    //Delete product

    async deleteProduct(req:Request,res:Response):Promise<void>{
       const id = req.params.id
       const data = await Product.findAll({
         where:{
            id:id
         }
       })

       if(data.length>0){
         await Product.destroy({
            where:{
               id:id
            }
            
          })
          res.status(200).json({
            message:"product deleted successfully"
          })
       }else{
         res.status(404).json({
            message:"no product with that id"
         })
       }
       
    }



    //Update product
  
   async updatePrduct(req:AuthRequest,res:Response):Promise<void>{

      const id = req.params.id;
   const userId = req.user?.id;  // Foreign key for product
   const { productName, productDescription, productPrice, productTotalStockQty, categoryId } = req.body;

   try {
       const oldDatas = await Product.findOne({
         where:{
            id:id
         }
       })
       
       if (!oldDatas) {
           res.status(404).json({ message: "Product not found" });
           return;
       }

       let fileName: string;

       if (req.file) {
           const oldImagePath = oldDatas?.productImageUrl //1727974378767-Parbhat.jpg
           
           if (oldImagePath) {
      
       const filePath = path.join(__dirname, '../uploads',oldImagePath)
         fs.unlink(filePath, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("File deleted");
    }
})
           }

           fileName = req.file.filename
       } else {
           fileName = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww";
       }

       if (!productName || !productDescription || !productPrice || !productTotalStockQty || !categoryId) {
           res.status(400).json({
               message: "Please provide ProductName, productDescription, productPrice, productTotalStockQty, categoryId"
           })
           return
       }

       await Product.update({
           productName,
           productPrice,
           productDescription,
           productTotalStockQty,
           productImageUrl: fileName,
           userId,
           categoryId
       }, {
           where: { 
            id:id
            }
       });

       res.status(200).json({ message: "Product updated successfully" });

   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Internal server error" });
   }
}

}


export default new ProductController()