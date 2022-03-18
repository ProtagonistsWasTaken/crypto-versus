/* 
  CODE AND WHATNOT: Pywon#3170 ("ThePywon" on github)
  TRUSTWORTHY HELPER AND COMMENTER: addikted#6615 ("AW1534" on github)
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

// other important imports
const { sendError } = require("./miscellaneous/error.js");
const { setup } = require("./database/schemas.js");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const { PORT } = process.env

// setup database schemas
setup();

// get all public file aliases
const aliasJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "./config/alias.json")));

// when a request is made by a user
const requestListener = function (req, res) {
  // region middleware stack
  let data = "";
  req.on("data", d => {
    data += d.toString();
  });

  // loop through all the aliases
  let alias = aliasJSON.filter(alias => alias.aliases.filter(a => a === req.url).length > 0)[0];
  if(alias) {
    // redirect to the alias
    res.statusCode = 302;
    res.setHeader('Location', alias.path);
    return res.end();
  }
  //endregion

  req.on("end", async () => {
    if(req.method === 'POST' || req.method === 'PUT') {
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
      if(endpoints[i].urls.filter(url => req.url === "/" + url).length > 0) {  // if user's request matches a path, run the corresponding file
        if(!endpoints[i].method || req.method === endpoints[i].method)
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

    // region preprocessors for public files

    //endregion

    // the request isnt handled, try to find a page in the public folder
    if(!res.finished) {
      // try to send file with the same name as the request
      if(fs.existsSync(path.join(__dirname, "public", req.url)))
        res.end(fs.readFileSync(path.join(__dirname, "public", req.url)));
      // try to send file with ejs
      else if(fs.existsSync(path.join(__dirname, "public", `${req.url}.ejs`)))
        res.end(ejs.render(fs.readFileSync(path.join(__dirname, "public", `${req.url}.ejs`), "utf8"), { req, res, data }));
      // try to send file with html
      else if(fs.existsSync(path.join(__dirname, "public", `${req.url}.html`)))
        res.end(fs.readFileSync(path.join(__dirname, "public", `${req.url}.html`)));
      // 404 response
      else if(!res.finished)
          sendError(res, {code:404,
            message:"Not found.",
            body:"This route is not available / not found"
          });
    }
  });
}


// start listening to requests ////////////////////////
const server = http.createServer(function (req, res) {
  try {
    requestListener(req, res)
  } catch (e) {
    console.log(e);
    sendError(res, {code:500,
      message:"Internal server error.",
      body:"Internal server error."
    });
  }
});

server.listen(PORT || 80, () => {
  console.log(`Server is running on port ${PORT}`);
});

// for automated testing
module.exports = server;
