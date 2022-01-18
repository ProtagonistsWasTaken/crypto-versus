/* 
  CODE AND WHATNOT: Pywon#3170
  TRUSTWORTY HELPER AND COMMENTER: addikted#6615
*/

try {
  // import dotenv (dev dependency)
  require("dotenv").config(); // IMPORTANT: set your environment variables into a file called .env ||  more info in README.md
} catch(e) {
  console.log(".env was not loaded. you can safely ignore this if your env values do not depend on it");
}

const http = require("http"); // require http module

// require all the routes and append them to a list named "paths"
const paths = require("./paths");

//Other important imports
const { sendError } = require("./miscellaneous/error.js");
const { setup } = require("./database/schemas.js");
const fs = require("fs");
const path = require("path");
//Setup database schemas
setup();

//Get all public file aliases
const aliases = JSON.parse(fs.readFileSync(path.join(__dirname, "./config/alias.json")));

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
        sendError(res, {code:400,
          message:"Expected json data.",
          body:"Json parsing failed."
        });
        return;
      }
    }

    console.log(`Requested '${req.url}' with method '${req.method}'\ndata: ${JSON.stringify(data)}`);

    res.setHeader("Access-Control-Allow-Origin", "*");
    
    // loop through all routes
    for(let i = 0; i < paths.length; i++)
      if(paths[i].urls.filter(url => req.url == "/" + url).length > 0) {  // if user's request matches a path, run the corresponding file
        if(!paths[i].method || req.method == paths[i].method)
        try {await paths[i].run(req, res, data);break;} 
        catch (e) {
          console.log(e);
          sendError(res, {code:500,
            message:"Internal server error.",
            body:"Internal server error."
          });
        }
        else {
          sendError(res, {code:405,
            message:"Unexpected method.",
            body:`path '${req.url}' should always be requested with method '${paths[i].method}'.`
          });
          return;
        }
      }

    // the request isnt handled, try to find a page in the public folder
    if(!res.finished) {
      try {
        // try to send file with the same name as the request
        res.end(fs.readFileSync(path.join(__dirname, "public", req.url)));
      } catch (e) {
        try {
          // try to send file with the same name as the request but with .html extension
          res.end(fs.readFileSync(path.join(__dirname, "public", req.url) + ".html"));

        } catch (e) {
          sendError(res, {code:404,
            message:"Not found.",
            body:"This route is not available / not found"
          })
        }

      }

    }
  });
};


// start listening to requests ////////////////////////
const server = http.createServer(requestListener);   //
const PORT = process.env["PORT"] || 80;              //
//                                                   //
server.listen(PORT, () => {                          //
  console.log(`Server is running on port ${PORT}`);  //
});                                                  //
//                                                   //
module.exports = server // for test.js               //