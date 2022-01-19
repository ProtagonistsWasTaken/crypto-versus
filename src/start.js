/* 
  CODE AND WHATNOT: Pywon#3170
  TRUSTWORTY HELPER AND COMMENTER: addikted#6615
*/

try {
  // import dotenv (dev dependency)
  require("dotenv").config(); // IMPORTANT: set your environment variables into a file called .env ||  more info in README.md
} catch(e) {
  console.log("dotenv was not loaded. you can safely ignore this if your env values do not depend on it");
}

const http = require("http"); // require http module

// require all the routes and append them to a list named "paths"
const endpoints = require("./endpoints");

//Other important imports
const { sendError } = require("./miscellaneous/error.js");
const { setup } = require("./database/schemas.js");
const fs = require("fs");
const path = require("path");
__dirname = path.join(__dirname, ".."); // set __dirname to the root of the project (for the sake of the public folder)
const ejs = require("ejs");
//Setup database schemas
setup();

//Get all public file aliases
const dataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "config/path-data.json")));

// when a request is made by a user
const requestListener = function (req, res) {
  // region middleware stack
  let data = "";
  req.on("data", d => {
    data += d.toString();
  });

  // loop through all the aliases
  let alias = dataJSON.filter(alias => alias.aliases.filter(a => a === req.url).length > 0)[0];
  if(alias) {
    // redirect to the alias
    res.statusCode = 302;
    res.setHeader('Location', alias.path);
    return res.end();
  }
  //endregion

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
    
    // loop through all routes
    for(let i = 0; i < endpoints.length; i++)
      if(endpoints[i].urls.filter(url => req.url == "/" + url).length > 0) {  // if user's request matches a path, run the corresponding file
        if(!endpoints[i].method || req.method == endpoints[i].method)
          try {await endpoints[i].run(req, res, data);break} 
          catch (e) {
            console.log(e);
            sendError(res, {code:500,
              message:"Internal server error.",
              body:"Internal server error."
            });
          }
        else
          return sendError(res, {code:405,
            message:"Unexpected method.",
            body:`path '${req.url}' should always be requested with method '${endpoints[i].method}'.`
          });
      }

    // the request isnt handled, try to find a page in the public folder
    if(!res.finished) {
      // try to send file with the same name as the request
      if(fs.existsSync(path.join(__dirname, "public", `${req.url}.ejs`)))
        res.end(ejs.render(fs.readFileSync(path.join(__dirname, "public", `${req.url}.ejs`), "utf8"), {
          req: req,
          res: res,
          data: data
        }));
      if(fs.existsSync(path.join(__dirname, "public", req.url)))
        res.end(fs.readFileSync(path.join(__dirname, "public", req.url)));
      else if(fs.existsSync(path.join(__dirname, "public", `${req.url}.html`)))
        res.end(fs.readFileSync(path.join(__dirname, "public", `${req.url}.html`)));
      else
        if(!res.finished)  // hey Pywon, I know you're tempted to delete this nested if statement, but if you do, it will become unreliable (I tried it without it
          sendError(res, {code:404,
            message:"Not found.",
            body:"This route is not available / not found"
          });
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
module.exports = server; // for test.js              //