// requiring all the dependecies/modules.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const app = express();

let entity_id;
let entity_type;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

// creating a get request for the home page of the web application
app.get("/", function(req, res) {
  res.render("index");
});


//fetching the data from zomato API and then posting it as an ejs file
app.post("/", function(req, res) {
  let name = [];
  let image = [];
  let url = [];
  const city = req.body.city;
  console.log(city);
  const url1 = "https://developers.zomato.com/api/v2.1/locations?query=" + city + "";
  const options = {
    headers: {
      "user-key": "25bec01e7505847366ca0c05dc187caa",
      "Accept": "application/json"
    }
  }
  https.get(url1, options, function(response) {
    console.log(response.statusCode);

    let data = "";
    response.on("data", function(chunk) {
      data = data + chunk;
    });
    response.on("end", function() {
      const jsonData = JSON.parse(data);
      entity_id = jsonData.location_suggestions[0].entity_id;
      entity_type = jsonData.location_suggestions[0].entity_type;

      const url2 = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entity_id + "&entity_type=" + entity_type + "";
      console.log(url2);
      const options = {
        headers: {
          "user-key": "25bec01e7505847366ca0c05dc187caa"
        }
      }
      https.get(url2, options, function(resp) {
        console.log(resp.statusCode);
        let data = "";
        resp.on("data", function(Chunk) {
          data = data + Chunk;
        });
        resp.on("end", function() {
          const jsonData1 = JSON.parse(data);
          for(i=0;i<10;i++){
              name.push(jsonData1.best_rated_restaurant[i].restaurant.name);
              image.push(jsonData1.best_rated_restaurant[i].restaurant.featured_image);
              url.push(jsonData1.best_rated_restaurant[i].restaurant.url);

          }

          res.render("search", {
            restaurantImage:image,
            restaurantName:name,
            restaurantUrl: url
          });

        });
      });


    });

  });




});

//listening on a local server at port 3000
app.listen("3000", function() {
  console.log("The server is working on port 3000.");
});
// Zomato API key:
// 25bec01e7505847366ca0c05dc187caa
