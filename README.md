# Crypto Versus

## A Multiplayer Versus Hacking Simulation

Inspired by the Steam game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/)

---



## Table of content

* [Possible outputs for all endpoints](#possible-outputs-any-endpoint)
* [Usage](#how-to-use)
* [Routes](#routes)
    * [/signup](#signup)
    * [/login](#login)
    * [/refresh-token](#refresh-token)
    * [/stuff](#dostuff)
* [Community](#community)



## How to use?

This assumes a basic knowledge of HTTP

### API
This api is an HTTP api. you can send a message to a server running *Crypto Versus* and it will respond. This is all you need to do to create a script! (wow, so simple)

### Wrapper
Sending HTTP requests is clunky. it gets annoying, and confusing quickly when you have loads of them. This is why we **highly** recommend you use a wrapper.

Wrappers will do exactly the same thing for you, but in a much more intuitive way

#### Official wrappers:
* Javascript - `cry_vs.js` **[npm](https://npmjs.com/package/@protagonists/cry_vs)** **|** **[GitHub](https://github.com/ThePywon/cry-vs.js)**
* Python - `cry_vs.js` **[PyPI](https://pypi.org/project/cry-vs.py/)** **|** **[GitHub](https://github.com/AW1534/cry-vs.py)**


### Servers
The official server is hosted on [Heroku](https://heroku.com).

Main branch domain: <https://cry-vs.herokuapp.com/>  
Dev branch domain:  <https://beta-cry-vs.herokuapp.com/>

_WARNING: there may be security issues in the dev branch. continue at your own disposal_
---


### Possible outputs (any endpoint)

#### Failed parsing (400)

This response is the result of a request that cannot be parsed into json  
To prevent this response from happening, across all languages, it is recommended to send **String formatted json**

##### Body

    Json parsing failed.

---

#### Not found (404)

This response is the result of a request made on an unfinished or invalid endpoint

##### Body

    This route is not available / not found.

---

#### Unexpected method (405)

This response is the result of a request made using a method invalid with the current endpoint

##### Body

    path '/[Path]' should always be requested with method '[Method]'.

\[Path] is the requested endpoint  
\[Method] is the request method used


## [/index](https://cry-vs.herokuapp.com/)

### Method

Any

### Input

Any

### Outputs

#### Success (200)

This response is the result of making a request on the main route

##### Body

    There's nothing here!


---

## [/signup](https://cry-vs.herokuapp.com/signup)

### Method

'POST'

### Input

    {"username":[Username],"password":[Password]}

\[Username] and \[Password] are expected to be string values  
Legal characters that can be used for these parameters are:

ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~/\\'"

(Case insensitive)

### Outputs

#### Success (200)

This response is the result of a successful account creation

##### Body

    [Token]

\[Token] is a connection token used to authenticate yourself when making requests to other endpoints  
A connection token created by this path lasts **20 minutes before expiring**

---

#### Missing data (400)

This response is the result of a missing parameter in the input json

##### Body

    username is required.

or

    password is required.

---

#### Illegal character (400)

This response is the result of an illegal character detected in either the username or password

##### Body

    Username contains the following illegal character: "[Char]"

or

    Password contains the following illegal character: "[Char]"

\[Char] is the character that posed a problem

---

#### Invalid length (400)

This response is the result of a username or password with a length over 30 or under 1

##### Body

    Username and password must have a length of 1 to 30 characters.

---

#### Invalid data (417)

This response is the result of a username or password which type is not "String"

##### Body

    Unexpected type for username.
    Expected String.

or

    Unexpected type for password.
    Expected String.

---

#### Already existent (403)

This response is the result of a request done on an already registered account username

##### Body

    [Username] already exists.

\[Username] is the requested account username



## [/login](https://cry-vs.herokuapp.com/login)

### Method

'POST'

### Input

    {"username":[Username],"password":[Password]}

\[Username] and \[Password] are expected to be string values

### Outputs

#### Success (200)

This response is the result of a successful connection

##### Body

    [Token]

\[Token] is a connection token used to authenticate yourself when making other requests  
A connection token created by this path lasts **10 minutes before expiring**

---

#### Missing data (400)

This response is the result of a missing parameter in the input json

##### Body

    username is required.

or

    password is required.

---

#### Invalid data (417)

This response is the result of a username or password which type is not "String"

##### Body

    Unexpected type for username.
    Expected String.

or

    Unexpected type for password.
    Expected String.

---

#### Not found (404)

This response is the result of a request done on an unresistant account

##### Body

    [Username] doesn't exists.

\[Username] is the requested account username

---

#### Invalid password (403)

This response is the result of a request done on an account with a password that doesn't match the account password

##### Body

    Invalid password.



## [/edit-account](https://cry-vs.herokuapp.com/edit-account)

### Method

'POST'

### Input

    {"token":[Token]}

\[Token] is expected to be a string value  
Any valid connection token can be used

Optional additional info

    {"username":[Username],"password":[Password]}

\[Username] and \[Password] are expected to be string values  
Legal characters that can be used for these parameters are:

ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~/\\'"

(Capitals do not matter)

### Outputs

#### Success (200)

This response is the result of a successful request

###### Body

    Account updated!

---

#### Missing token (400)

This response is the result of a missing token parameter in the input json

##### Body

    Token is required.

---

#### Invalid token (403)

This response is the result of requesting to the endpoint with an invalid/expired token

##### Body

    Token is invalid.

---

#### Illegal character (400)

This response is the result of an illegal character detected in either the username or password

##### Body

    Username contains the following illegal character: "[Char]"

or

    Password contains the following illegal character: "[Char]"

\[Char] is the character that posed a problem



## [/delete-account](https://cry-vs.herokuapp.com/delete-account)

### Method

'POST'

### Input

    {"token":[Token]}

\[Token] is expected to be a string value  
Any valid connection token can be used

### Outputs

#### Success (200)

This response is the result of a successful account deletion

##### Body

    [Username] deleted successfully!

\[Username] is the token's corresponding account username

---

#### Missing token (400)

This response is the result of a missing token parameter in the input json

##### Body

    Token is required.

---

#### Invalid token (403)

This response is the result of requesting to the endpoint with an invalid/expired token

##### Body

    Token is invalid.

---

#### Database error

This response is the result of a valid request that somehow created a database error  
This should never happen, if it does, [tell us](#community)



## [/refresh-token](https://cry-vs.herokuapp.com/refresh-token)

### Method

'POST'

### Input

    {"token":[Token]}

\[Token] is expected to be a string value  
Any valid connection token can be used

### Outputs

#### Success (200)

This response is the result of a successful token refresh

Reminder that this endpoint **does not*** increase the lifetime of the current token  
It generates a new one and invalidates the first

##### Body

    [Token]

\[Token] is a connection token used to authenticate yourself when making other requests  
A connection token created by this path lasts **5 minutes before expiring**

---

#### Missing token (400)

This response is the result of a missing token parameter in the input json

##### Body

    Token is required.

---

#### Invalid token (403)

This response is the result of requesting to the endpoint with an invalid/expired token

##### Body

    Token is invalid.



## [/dostuff](https://cry-vs.herokuapp.com/dostuff)

### Method

'POST'

### Input

    {"token":[Token]}

\[Token] is expected to be a string value  
Any valid connection token can be used

### Outputs

#### Success (200)

This response is the result of a successful request  
This endpoint is temporary and was made solely for testing purposes

##### Body

    Successfully did stuff as [Username]

\[Username] is the token's corresponding account username

---

#### Missing token (400)

This response is the result of a missing token parameter in the input json

##### Body

    Token is required.

---

#### Invalid token (403)

This response is the result of requesting to the endpoint with an invalid/expired token

##### Body

    Token is invalid.

## Community

Found an issue? got any questions? you can contact these contributors

- [Pywon](https://github.com/ThePywon)
- [A_W1534 / addikted](https://github.com/AW1534)

Here is the [Code of Conduct](./CODE_OF_CONDUCT.md) for this community!
