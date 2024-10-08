import { AuthRequest } from "../middleware/middleware";
import { Response } from "express";
import { KhaltiResponse, OrderData, PaymentMethod, PaymentStatus, TransactionResponse, TransactionStatus } from "../types/orderTypes";
import Order from "../database/models/order";
import Payment from "../database/models/payment";
import OrderDetail from "../database/models/orderDetails";
import axios from "axios";


class OrderController{

    //Create operation
    
    async createOrder(req:AuthRequest,res:Response):Promise<void>{
        const {shippingAddress,phoneNumber,totalAmount,paymentDetails,items}:OrderData = req.body
        const userId = req.user?.id
        if(!phoneNumber||!shippingAddress||!totalAmount||!paymentDetails||!paymentDetails.paymentMethod||items.length==0){
            res.status(400).json({
             message:"please provide shippingAddress,phoneNumber,totalAmount,paymentDetails,items"
            })
            return
        }
       
       
      const paymentData = await Payment.create({
            paymentMethod:paymentDetails.paymentMethod
        })
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId:paymentData.id

        })
        

        for(let i=0;i<items.length;i++){
            await OrderDetail.create({
                quantity:items[i].quantity,
                productId:items[i].productId,
                orderId:orderData.id
              })
        }
        if(paymentDetails.paymentMethod===PaymentMethod.khalti){

            //khalti integration
            const data ={
                return_url:"http://localhost:3000/success", //payment success vayo vane khalti le kun page ma redirect garne vanne kura ho
                purchase_order_id:orderData.id,
                amount:totalAmount*100, //khalti le rupees ma accept gardaina paisa ma accept garxa.
                website_url:"http://localhost:3000/",//hamro site ko url ho
                purchase_order_name:"orderName_"+ orderData.id,// order name ho//but hami j name handa ni junxa hello bye.
            }
            //api hit hanne 
         const response =  await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
                headers:{
                    "Authorization":"key c8c761f767da48b0a521390401f85d44"
                }
            })
            // console.log(response)
    
            const khaltiResponse:KhaltiResponse=response.data
            paymentData.pidx=khaltiResponse.pidx
            // paymentData.paymentStatus="paid" //verify nagari payment status "paid" gareko
            paymentData.save()
            res.status(200).json({
                message:"order placed successfully",
                url:khaltiResponse.payment_url
            })
           
        }else{
            res.status(200).json({
                message:"order placed successfully"
            })
        }
         
    }



    // verify pidx
    async verifyTransaction(req:AuthRequest,res:Response):Promise<void>{
        const {pidx}=req.body
        if(!pidx){
            res.status(400).json({
                message:"please provide pidx"
            })
            return
        }
        const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
            headers:{
                     "Authorization":"key c8c761f767da48b0a521390401f85d44"
            }
        })
        const data:TransactionResponse=response.data
        if(data.status===TransactionStatus.Completed){
            await Payment.update({paymentStatus:PaymentStatus.Paid},{
                where:{
                    pidx:pidx
                }
            })
            res.status(200).json({
                message:"payment verified successfully"
            })

        }else{
            res.status(200).json({
                message:"not verified"
            })
        }
    }
}

export default new OrderController()