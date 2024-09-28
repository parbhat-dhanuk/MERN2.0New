
import { Request,Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt"


class AuthController{

   public static async registerUser(req:Request,res:Response):Promise<void>{     //async method(function)ho 
                                                  // async method vayepaxi hami le return type Promise<void> nai hunxa.
        const {username,email,password}=req.body
        if(!username||!email||!password){
            res.status(400).json({
                message:"please provide username,email,password"
            })
            return
        }
     await User.create({
        username,  //key valur pair same xa vanepaxi {username,password,email} lekda ni hunxa.
        email,
        password : bcrypt.hashSync(password,8)    //(k kura hash garne, saltValue) //Normally salt value 8,10,12 samma rakne.
      })
      res.status(200).json({
        message:"user registered"
      })

    }
}

// const AuthControllers = new AuthController      //yo chai instance tarika le export gareko
// export default AuthControllers                   instatic instance garne maan chaina 
                                                 //vane mathi register method ma public satic aagdhi lekdine.
export default AuthController