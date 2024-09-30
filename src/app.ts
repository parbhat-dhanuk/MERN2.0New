import express , {Application,Request,Response} from "express"

const app:Application=express()
const port:number = 3000

import * as dotenv from "dotenv"
dotenv.config()
import './database/connection'

app.use(express.json())  //main line ho yo natra API Hit hudaina yo line navayepaxi yo halna bisrinu vayena.

import userRouter from "./routes/userRoute" //userRoute import gareko
import adminSeeder from "./Seeder/adminSeeder"
app.use("",userRouter) //localhost:400/register//  if "" vitra "/hello" va ko vaye localhost:4000/hello/register hunthoe.      
 

//adminSeedser
adminSeeder()




app.listen (port,()=>{
    console.log("Running in port",port)
})