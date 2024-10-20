import { http, HttpResponse } from "msw"
import { server } from "./mocks/server"
import { db } from "./mocks/db"
import { faker } from "@faker-js/faker"

export const getServerEndpoint=(endpoint)=>{
    server.use(http.get(endpoint, () => HttpResponse.json([]) ))
}


export const generateProductName=()=>{
    const generateName=()=>faker.commerce.productName
    if (db==undefined) return generateName()
    if (db.product==undefined) return generateName()
    const allproducts=db.product.getAll()
    if (allproducts.length==0) return generateName()
    const productsNames=allproducts.map(product=>product.name)
    const cycleCounter=0
    while (true){
        cycleCounter+=1
      const name =generateName()
      if (!productsNames.includes(name)){
        return name
      }
      if (cycleCounter>100) return (name+" v2")
    }
  }

  export const generateCategoryName=()=>{
    const generateName=()=>faker.commerce.department
    if (db==undefined) return generateName()
    if (db.category==undefined) return generateName()
    const allcategories=db.category.getAll()
    if (allcategories.length==0) return generateName()
    const categoryNames=allcategories.map(category=>category.name)
    const cycleCounter=0
    while (true){
        cycleCounter+=1
      const name =generateName()
      if (!categoryNames.includes(name)){
        return name
      }
      if (cycleCounter>100) return (name+" v2")
    }
  }