const mongoose = require("mongoose");

//connecting to local database (27017/dataBaseName)
mongoose.connect("mongodb://localhost:27017/myDataBase");

//A new schema to create a relationship with the person collection
const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});


// creating a new schema for product
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
});

//Creating another schema for Person
const PersonSchema = new mongoose.Schema({
  //Validation of the field "fName"
  fName: {
    type: String,
    required: [true, "Please check you data. You missed to give the input for name field"]
  },
  lName: String,
  age: Number,
  phone: String,

  //using the fruitSchema and productSchema I just create a new relationship with other collections
  favFruit: fruitSchema,
  favProduct: productSchema
});


//Creating new models for Product and Person
const Product = mongoose.model("Product",productSchema);
const Person = mongoose.model("Person", PersonSchema);
const Fruits = mongoose.model("fruit", fruitSchema);


//Inserting value to fruits collection
const banana = new Fruits({
  name: "Banana",
  rating : 3,
  review: "Good"
});
const mango = new Fruits({
  name: "Mango",
  rating: 5,
  review: "Best"
})
const lichi = new Fruits({
  name: "Lichi",
  rating: 4,
  review: "Sweet"
})
//Fruits.insertMany([banana, mango, lichi], function(err){});



//Using the Product model creating a new data
const pen = new Product({
  name: "Pen",
  price: 12,
  stock: 20
});
const pencil = new Product({
  name: "Pencil",
  price: 10,
  stock: 50
});

//Saving the data to the collection (kind of insertion)
// pen.save();
// pencil.save();



//Using the Person model creating new data
const emu = new Person({
  fName: "Fokhrun Nahar",
  lName: "Emu",
  age: 20,
  phone: "+8801853381815",
  favFruit: banana,
  favProduct: pen
});
const fahim=new Person({
  fName: "Asibul Hasan",
  lName: "Fahim",
  age: 23,
  phone: "+8801991054578",
  favFruit: mango,
  favProduct: pencil
});
const fariha = new Person({
  fName: "Fariha Afrin",
  lName: "Tamanna",
  age: 20,
  phone: "+88017154964",
  favFruit: lichi,
  favProduct: pencil
});


// //Inserting multiple items to the collection Person
// Person.insertMany([emu, fahim, fariha], function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Succeed");
//   }
// });


// //Reading data from collection
// Person.find(function(err, person){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(person);
//
//     // .find() method gives an array containing all the data and all the data transform into javascript object. hence can access all the data using the dot notation
//     mongoose.connection.close();
//     person.forEach(function(name){
//       console.log(name.fName +" "+ name.lName);
//     });
//   }
// });


// //Updating a data using .updateOne() method
// Person.updateOne({_id: "613a3e0388911f8357609e7e"}, {phone: "+8801715496433"}, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Inserted");
//   }
// });


// //Deleting data using the .deleteOne() method
// Person.deleteOne({lName: "Emu"}, function(err){});
//
// //Deleting data using the .deleteMany() method
// Product.deleteMany({price: 12}, function(err){
//   if(err){
//     console.log(err);
//   } else{
//     console.log("Deletion successfully");
//   }
// });





console.log("done");
