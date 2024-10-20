import { http, HttpResponse } from "msw"
import { server } from "./mocks/server"
import { db } from "./mocks/db"
import { faker } from "@faker-js/faker"

export const getServerEndpoint=(endpoint)=>{
    server.use(http.get(endpoint, () => HttpResponse.json([]) ))
}


export const generateProductName=()=>{
    const generateName=faker.commerce.productName
    if (db==undefined) return generateName()
    if (db.product==undefined) return generateName()
    const allproducts=db.product.getAll()
    if (allproducts.length==0) return generateName()
    const productsNames=allproducts.map(product=>product.name)
    var cycleCounter=0
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
    const generateName=faker.commerce.department
    if (db==undefined) {
        const name=generateName()
        // console.log('db is undefind. Output name: '+name)
        return name
    }
    if (db.category==undefined) {
        const name=generateName()
        // console.log('db.category is undefind. Output name: '+name)
        return name 
    }
    const allcategories=db.category.getAll()
    // console.log(`Found ${allcategories.length} categories.`)
    if (allcategories.length==0) {
        const name=generateName()
        // console.log('allcategories.length==0. Output name: '+name)
        return name
    }
    const categoryNames=allcategories.map(category=>category.name)
    // console.log('existing categories Names:')
    // console.log(categoryNames)
    var cycleCounter=0
    while (true){
      cycleCounter+=1
      const name =generateName()
      if (!categoryNames.includes(name)){
        // console.log(`Current name ${name} is not in a list. Returning ${name}`)
        return name
      }
      if (cycleCounter>100) {
        name=name+" v2"
        // console.log(`cycleCounter>100. Returning ${name}`)
        return name
      }
    }
    // console.log('I am outside while cycle. I shall not be here.')
  }