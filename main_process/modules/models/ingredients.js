
import PouchDB from 'pouchdb'



const db = new PouchDB('db/ingredients')



export default class {
   

 
    /**
     * @description database malzeme ekleme
     * @param {*} ingradient malzeme objesi
     * @returns eklenen malzeme
     */
    static async add(ingradient) {
       try {

           if(!await IsExist(ingradient.name)) return new Error('malzeme sistemde mevcut')
            // malzeme sistemde mevcutsa error throw et
      


            const newDoc = await db.post(ingradient)
            return await db.get(newDoc.id)

       } catch (error) {
            console.error(error)
       }
    }


 
    /**
     * @description database teki malzemeleri id ye göre günceller
     * @param {*} id // malzeme id si
     * @param {*} ingradient // malzeme objesi
     */
    static async update(id,ingradient) {
        //https://pouchdb.com/api.html#create_document
        return await db.get(id).then(doc => {
            return db.put({
                _id : id,
                _rev: doc._rev,
                
                ...ingradient
            })
        }).then(doc => doc).catch(error => error)
    }

   // database tüm malzemeleri getir
    static async get() {
         const docs = await db.allDocs({
            include_docs : true
        }).catch(e => console.error(e))

        return docs 
    }



}



async function IsExist(name) {
        
    let ingradients =  await db.allDocs({
        include_docs : true
    })
    

    
    const ingradientIndex = ingradients.rows.findIndex(x => x.doc.name == name)

    return ingradientIndex != -1 ? false : true
}