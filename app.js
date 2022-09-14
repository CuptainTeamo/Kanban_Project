
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-Ryan:Sry12345678@cluster0.8bco689.mongodb.net/kanbanDB");

const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", itemSchema);

const notStartList = new List({
  name: "Not Started",
  items: []
});

const inProgessList = new List({
  name: "In Progress",
  items: []
});

const completeList = new List({
  name: "Completed",
  items: []
});

const item1 = new Item({
  name: "+ to Add item"
});

const item2 = new Item({
  name: "double click to delete"
});

const item3 = new Item({
  name: "drag and drop item"
});

const defaultItems = [item1, item2, item3];

const defaultLists = [notStartList, inProgessList, completeList];

// Run kanban
app.get("/", function(req, res){
  //res.render("login");
  List.find({}, (err, foundItems) => {
    if(!err){
      if(foundItems.length === 0){
        List.insertMany(defaultLists, (err) => {
          if(err){console.log(err);}
          else {console.log("Default Array added successfully");}
        });
        res.redirect("/")
      }else{
        res.render("kanban", {lists: foundItems});
      }
    }
  });
});

// Add new item
app.post("/", function(req, res){
  const name = req.body.newItemName;
  const listName = req.body.list;

  const newItem = new Item({
    name: name
  });

  List.findOne({name: listName}, (err, foundList) => {
    foundList.items.push(newItem);
    foundList.save();
    res.redirect("/");
  });
});

// Delete an item
app.post("/delete", function(req, res){
  const listName = req.body.listName;
  const deletedItemId = req.body.input;
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deletedItemId}}}, (err, foundList) => {
    if (!err){
      res.redirect("/");
    }
  });
});


let draggedItemId = "";
let draggedListName = "";
let draggedItemName = "";
app.post("/dragstart", (req, res) => {
  draggedItemId = req.body.input;
  draggedListName = req.body.listName;
  draggedItemName = req.body.itemName;
  res.redirect("/");
})

//When Item dropped in the zone
app.post("/drop", (req, res) => {
  const itemId = req.body.input;
  const listName = req.body.listName;

  // delete from original list
  List.findOneAndUpdate({name: draggedListName}, {$pull: {items: {_id: draggedItemId}}}, (err, foundList) => {
    if (!err){
      console.log("deleted successfully from original list");
    }
  });
  
  // Find the position index of the targetted position
  let newArray = [];

  // construct a new item with the same content
  const newItem = new Item({
    name: draggedItemName
  });
  List.find({name: listName}, (err, foundLists) => {
    indexOfTarget = 0;
    newArray = [];
    for(const list of foundLists){
      for(let i = 0; i < list.items.length; i++){
        if (list.items[i]._id == itemId){
          indexOfTarget = Number(i + 1);
          newArray.push(list.items[i]);
          newArray.push(newItem);
        }else{
          newArray.push(list.items[i]);
        }
      }
    }
    List.findOneAndUpdate({name: listName}, {items: newArray}, (err) => {
      if(err){
        console.log(err);
      }
    });
   }
  );

  

  res.redirect("/");
})



// Run the application
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function(){
  console.log("The server starts successfully!");
});

