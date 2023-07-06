const { connectToDb } = require("./connection");
const { collectionName } = require("./collection");

// Establish database connection
const db=connectToDb();

// Define validation schema for the "userCollection" collection
db.collection(collectionName.userCollection, {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         title: "User Object Validation",
         required: [ "firstname", "lastname", "email", "password", "picturepath", "friends", "location", "occupation", "viewedprofiles", "impressions" ],
         properties: {
            firstname: {
               bsonType: "string",
               description: "'firstname' must be a string and is required"
            },
            lastname: {
               bsonType: "string",
               description: "'lastname' must be a string and is required"
            },
            email: {
               bsonType: "string",
               pattern: "^\\S+@\\S+\\.\\S+$",
               description: "'email' must be a valid email address and is required"
            },
            password: {
               bsonType: "string",
               minLength: 8,
               description: "'password' must be a string with a minimum length of 8 characters and is required"
            },
            picturepath: {
               bsonType: "string",
               description: "'picturepath' must be a string"
            },
            friends: {
               bsonType: "array",
               description: "'friends' must be an array"
            },
            location: {
               bsonType: "object",
               description: "'location' must be an object"
            },
            occupation: {
               bsonType: "string",
               description: "'occupation' must be a string"
            },
            viewedprofiles: {
               bsonType: "array",
               description: "'viewedprofiles' must be an array"
            },
            impressions: {
               bsonType: "int",
               description: "'impressions' must be an integer"
            }
         }
      }
   }
});

 
