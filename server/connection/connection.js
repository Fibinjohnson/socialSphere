const {MongoClient}=require("mongodb");

async function connectToDb(){
const url=process.env.MONGOURL;
const client=new MongoClient('mongodb://127.0.0.1:27017/');
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