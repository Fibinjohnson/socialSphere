const { connectToDb } = require("./connection");
const { collectionName } = require("./collection");

// Establish database connection
const db=connectToDb();

// Define validation schema for the "userCollection" collection
db.collection(collectionName.postCollection, {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         title: "post Object Validation",
         required: [ "userId", "firstName", "lastName", "location", "description", "picturePath", "userPicturePath", "likes", "comments", "timestamp" ],
         properties: {
            userId: {
               bsonType: "objectid",
               description: "'userid' must be a string and is required"
            },
            firstName: {
               bsonType: "string",
               description: "'lastname' must be a string and is required"
            },
            lastName: {
               bsonType: "string",
               pattern: "^\\S+@\\S+\\.\\S+$",
               description: "'email' must be a valid email address and is required"
            },
            location: {
               bsonType: "string",
               minLength: 8,
               description: "'password' must be a string with a minimum length of 8 characters and is required"
            },
            picturepath: {
               bsonType: "string",
               description: "'picturepath' must be a string"
            },
            description:{
                bsonType:"string",
                description:"description error"
            },
            likes: {
               bsonType: "bool",
              
               description:"required like"
            },
            comments: {
               bsonType: "array",
               description: "'comments' must be an array"
            },
            timestamp: {
              bsonType:"timestamp",
              description:"date is required"
            }
            
         }
      }
   }
});