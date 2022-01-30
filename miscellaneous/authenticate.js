const { Token, Tokens } = require("./token_handler");
const { User } = require("../database/schemas")
const cookie = require("cookie");


function _set(res, token) {
    console.log("setting cookie");
    res.setHeader("Set-Cookie",
        cookie.serialize("token", token, {
            maxAge: 60 * 60 * 24 * 7,   // max age. doesn't really matter, as the token will go invalid anyway, but you can change this to the token lifetime if you want
            httpOnly: true,             // tell the browser not to let the browser or any script access the cookie; only the server can access it
            sameSite: "strict",         // tell the browser not to send the cookie to cross-site requests
            path: "/",                  // tell the browser to only send the cookie to requests that start with "/"
        })
    )
}

module.exports = {
    set:_set,
    authenticate:function(req, res, data) {
        // get the token from either the cookie or the body

        if (req.headers.store_token === undefined) {
            req.headers.store_token = false;
        }
        if (data.token && req.headers.store_token == false) {
            _set(res, data.token);

            res.statusCode = 302;
            res.setHeader('Location', req.url);
            res.setHeader('Content-Type', 'text/plain');

        } else {
            try {
                var cookies = cookie.parse(req.headers.cookie);
                data.token = cookies.token;
                console.log("token from cookie: " + data.token);
            } catch (e) {
                return [{
                    authenticated: false
                }];
            }
        }

        // if the token is valid, return the user
        const token = Tokens.findOne({ value: data.token });
        console.log("tokesdbhhbffdn: " + token);
        if (token) {
            console.log("username: " + token.user);
            User.findOne({ username: token.user }, (err, user) => {
                console.log("user: " + user);
                const e = [{
                    authenticated: true,
                    user: user,
                    token: token
                }];
                console.log("e: " + e);
                return e;
            });
        } else {
            console.log("token not valid");
            // this probably will not be reached
            return [{
                authenticated: false,
            }];
        }
    }
}