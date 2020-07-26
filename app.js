const express = require("express");
const bodyparser = require("body-parser");
const urllib = require("urllib");
var http = require("https");


const app = express();

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));


// Creating a array which will store objects
  var Item = [];

  var count = 0;
app.get("/", function(request, response) {

  var d = new Date();
  var year = d.getFullYear()
  var date = d.getDate();
  var day = d.getDay();
  if (day === 0) {
    day = "Sunday";
  }
  if (day === 1) {
    day = "Monday";
  }
  if (day === 2) {
    day = "Tuesday";
  }
  if (day === 3) {
    day = "Wednesday";
  }
  if (day === 4) {
    day = "Thrusday";
  }
  if (day === 5) {
    day = "Friday";
  }
  if (day === 6) {
    day = "Saturday";
  }
  response.render("List.ejs",{
    todaydate: day + " " + date,
    kindofday: "Today",
      newitem: Item,
   kindofyear: year,
      counter: count
  }
);

});
app.post("/", async (request, response) => {
  var x = request.body.second;
  var y = request.body.list;
  var unit = request.body.unit;
  var quantity = request.body.quantity;
  console.log("Unit :" + unit);
  console.log("quantity :" + quantity);
  if (x != "") {
    //saving new items to table
    if (y === "Today") {
      var options = {
        "method": "GET",
        "hostname": "edamam-edamam-nutrition-analysis.p.rapidapi.com",
        "port": null,
        "path": '/api/nutrition-data?ingr=' + quantity + '%20' + unit + '%20' + x,
        "headers": {
          "x-rapidapi-host": "edamam-edamam-nutrition-analysis.p.rapidapi.com",
          "x-rapidapi-key": "ea6b247674mshea2a2d4358e02e2p1759a7jsna06f1eccc815",
          "useQueryString": true
        }
      };
      var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
          chunks.push(chunk);
        });

        res.on("end", function() {
          // console.log("FROM");
          // console.log(chunks);
          var newbody = JSON.parse(chunks);
          // console.log("TO");
          // console.log(newbody);
          count = count + newbody.calories;
          var _id = Math.floor((Math.random() * 1000) + newbody.calories);
          console.log("_id " + _id);
          const newitem = {
            name: x,
            calvl: newbody.calories,
            id:  _id,
            quants : quantity,
            unt : unit
          }
          Item.push(newitem);
          response.redirect("/");
        });
      });
      req.end();
    }

  }
});


app.post("/delete", function(request, response) {
  const val = request.body.third;
  const lname = request.body.forth;
  const cval = request.body.fifth;
  console.log("val :" +val);
  console.log("cval :" + cval);

    console.log("before deletion : " + count);
    console.log(Item);
    count = count - cval;
    const index = Item.findIndex(items => items.id == val);
    console.log("index : " + index);
    Item.splice(index,1);

    console.log("After deletion : " + count);
    console.log(Item);


  if (lname === "Today") {
    console.log("Deletion");
      response.redirect("/");
  }
});


app.post("/clear", function(request, response) {
  Item.splice(0, Item.length);
  count=0;
  response.redirect("/");
});



app.listen(3000, function() {
  Item.forEach((item, index, array) => {
    count =count+ item.calvl;
});

  console.log("Started");
});
