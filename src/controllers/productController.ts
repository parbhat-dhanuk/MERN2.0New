
import {Request,Response} from "express"
import Product from "../database/models/productModel"
import { AuthRequest } from "../middleware/middleware"
import User from "../database/models/userModel"
import Category from "../database/models/category"
import fs from 'fs'
import path from "path"
import FileUploadService from "../middleware/multerMiddleware"
import cloudinary from "../utils/cloudinary"





class ProductController{

   async addProduct(req:AuthRequest, res: Response):Promise<void> {
      const upload = FileUploadService.getUploadMiddleware();
      const userId=req.user?.id
      let fileName:string
      upload(req, res, async (err: any) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('File size too large. Max size is 2MB.');
          }
          return res.status(500).send(err.message || 'Error uploading file');
        }
  
        if (!req.file) {
         //  return res.status(400).send('Please upload an image.');
          fileName="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww"
        }
  
        try {
          // Upload image buffer directly to Cloudinary
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'MERN',  // Specify your folder name here
            },
            async (error, result) => {
              if (error) {
                return res.status(500).send('Failed to upload image to Cloudinary.');
              }
  
              try {
                // Save product details and image URL in MySQL database
                const product = await Product.create({
                  productName: req.body.productName,
                  productDescription: req.body.productDescription,
                  productImageUrl: result?.secure_url|| fileName,
                  productPrice:req.body.productPrice,
                  productTotalStockQty:req.body.productTotalStockQty,
                  userId:userId,
                  categoryId:req.body.categoryId
                  // productName,
                  // productPrice,
                  // productDescription,
                  // productTotalStockQty,
                  // productImageUrl: fileName,
                  // userId,
                  // categoryId

                });
  
                return res.status(201).json({
                  message: 'Product created successfully',
                  product,
                });
              } catch (dbError) {
                return res.status(500).json({ error: 'Failed to create product' });
              }
            }
          );
  
          // Stream the file buffer to Cloudinary
          stream.end(req.file?.buffer);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create product' });
        }
      });
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