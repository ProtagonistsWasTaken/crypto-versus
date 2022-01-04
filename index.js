/* 
  CODE AND WHATNOT: Pywon#3170
  TRUSTWORTY HELPER AND COMMENTER: addikted#6615
*/

try {
  // import dotenv (dev dependency)
  require("dotenv").config(); // set your environment variables into a file called .env more info in README.md
} catch(e) {
  console.log("dotenv wasnt loaded.")
}

const http = require("http"); // require http module

// require all the routes and append them to a list named "paths"
const paths = require("./paths");

const {setup} = require("./database/schemas.js");
setup();

// when a request is made by a user
const requestListener = function (req, res) {
  var data = "";

  req.on("data", d => {
    data += d.toString();
  });

  req.on("end", async () => {
    if(req.method == 'POST' || req.method == 'PUT') {
      // try to parse the user's data
      try{ data = JSON.parse(data) }
      catch(e) {
        // send an error message if failed
        res.statusMessage = "Expected json data.";
        res.statusCode = 400;
        res.end("Json parsing failed.");
        return;
      }
    }

    // loop through all rotes
    for(let i = 0; i < paths.length; i++)
      if(req.url == "/" + paths[i].name) {  // if user's request matches a path, run the file
        if(!paths[i].method || req.method == paths[i].method)
          await paths[i].run(req, res, data);
        else {
          res.statusMessage = "Unexpected method.";
          res.statusCode = 405;
          res.end(`path '/${paths[i].name}' should always be requested with method '${paths[i].method}'.`);
          return;
        }
      }
    
    // if no response is sent, send a 404
    if(!res.finished) {
      res.statusCode = 404
      res.statusMessage = "Not found."
      res.end("This route is not available / not found");
    }
  });
};


// start listening to requests ///////////////////////
const server = http.createServer(requestListener);  //
const PORT = process.env["PORT"] || 443;            //
                                                    //
server.listen(PORT, () => {                         //
  console.log(`Server is running on port ${PORT}`); //
});                                                 //
