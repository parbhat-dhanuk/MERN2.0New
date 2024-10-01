import Category from "../database/models/category"


class CategoryController{
                                         //Category Seeder
    categoryData=[
        {
            categoryName:"Electronics"
        },

        {
            categoryName:"Groceries"
        },
        
        {
            categoryName:"Food/Beverages"
        }
    ]



   async seedCategory():Promise<void>{
    const datas = await Category.findAll()

    if(datas.length===0){
     await  Category.bulkCreate(this.categoryData)
     console.log("category seeded successfully")
    }else{
        console.log("category already seeded")
    }
}

}

export default new CategoryController()