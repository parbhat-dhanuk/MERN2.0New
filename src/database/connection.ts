import {Sequelize} from "sequelize-typescript"
import User from "./models/userModel"
import Product from "./models/productModel"
import Category from "./models/category"

const sequelize= new Sequelize({
 database:process.env.DB_NAME,
 dialect:"mysql",
 username:process.env.DB_USERNAME,
 password:process.env.DB_PASSWORD,
 host:process.env.DB_HOST,
 port:Number(process.env.DB_PORT),

 models:[__dirname + "/models"]
})

sequelize.authenticate()
.then(()=>{
    console.log("connected")
}).catch((err)=>{
console.log(err)
})

sequelize.sync({force:false}).then(()=>{
 console.log("synced !!!")
})


//Relationsship 
// yo code le Product table ma userId vanne foreign key banuxa jo User table sanga connected hunxa.

User.hasMany(Product,{foreignKey:"userId"}) 
Product.belongsTo(User,{foreignKey:"userId"})

Category.hasOne(Product,{foreignKey:"categoryId"})
Product.belongsTo(Category,{foreignKey:"categoryId"})



export default sequelize