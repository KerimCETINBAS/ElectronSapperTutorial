import PouchDB from 'pouchdb'




const db = new PouchDB('db/recipe')




export default class {
   

 
    /**
     * @description database tarif ekleme
     * @param {*} recipe tarif objesi
     * @returns eklenen tarif
     */
    static async add(recipe) {
       try {
             // tarif sistemde mevcutsa error throw et
           if(!await IsExist(recipe.recipeName)) return new Error('Yemek tarifi sistemde mevcut')
          
            const newDoc = await db.post(recipe)
            return await db.get(newDoc.id)

       } catch (error) {
            //console.error(error)
       }
    }


 
    /**
     * @description database teki tarifleri id ye göre günceller
     * @param {*} id // malzeme id si
     * @param {*} tarif// tarif objesi
     */
    static async update(id,recipe) {
        //https://pouchdb.com/api.html#create_document
        return await db.get(id).then(doc => {
            return db.put({
                _id : id,
                _rev: doc._rev,
                // objeden oluşan arrayı destruct et
                ...recipe
            })
        }).then(doc => doc).catch(error => error)
    }

   // database tüm tarifleri getir
    static async get() {
        return await db.allDocs({
            include_docs : true
        })
    }



}



async function IsExist(name) {
        
    let recipes =  await db.allDocs({
        include_docs : true
    })
    

    
    const recipeIndex = recipes.rows.findIndex(x => x.doc.recipeName == name)

    return recipeIndex != -1 ? false : true
}