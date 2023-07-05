const {MongoClient}=require("mongodb");

async function connectToDb(){
const url=process.env.MONGOURL;
const client=new MongoClient(url);
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