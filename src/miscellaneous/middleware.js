// middleware - add a function here to be called before the route is called. it can modify the request and response objects.

let stack = []  // Stack of middleware

// run the middleware stack
function run(req, res) {
    function next() {
        let fn = stack.shift()
        if (fn) {
            fn(req, res, next)
        }
    }

    for (let i = 0; i < stack.length; i++) {
        stack[i](req, res, next)
    }

    return {
        req, res
    }
}

// Add middleware to stack
function use(fn) {
    stack.push(fn)
}

module.exports = {
    run,
    use
}