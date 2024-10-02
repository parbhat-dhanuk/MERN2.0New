import express , {Application,Request,Response} from "express"

const app:Application=express()
const port:number = 4000

import * as dotenv from "dotenv"
dotenv.config()
import './database/connection'

app.use(express.json())  //main line ho yo natra API Hit hudaina yo line navayepaxi yo halna bisrinu vayena.

import userRouter from "./routes/userRoute" //userRoute import gareko
import productRoute from  "./routes/productRoute"
import adminSeeder from "./Seeder/adminSeeder"
import categoryRouter from "./routes/categoryRoutes"
import categoryController from "./controllers/categoryController"

app.use("",userRouter) //localhost:400/register//  if " " vitra "/hello" va ko vaye localhost:4000/hello/register hunthoe.      
app.use("/admin/product",productRoute)//product route

app.use("/admin",categoryRouter)



app.listen (port,()=>{
    console.log("Running in port",port)
    adminSeeder()                         //adminSeeder
    categoryController.seedCategory()     //category seeder invoke
})

