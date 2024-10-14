const {MongoClient}=require("mongodb");

async function connectToDb(){
    const uri = "mongodb://0.0.0.0:27017/";
    const client = new MongoClient(uri);
try{
await client.connect();
const database=client.db("Sociom");
return database;

}catch(error){
console.log("connection,to mongodb error,:",error)
}
}
module.exports={
    connectToDb
}