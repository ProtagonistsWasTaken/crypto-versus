// middleware - add a function here to be called before the route is called. it can modify the request and response objects.

let stack = []  // Stack of middleware

// run the middleware stack
function run(req, res) {
    let _stack = stack.slice()  // copy the stack, so it can be modified in the loop
    function next() {
        let fn = _stack.shift()
        if (fn) {
            fn(req, res, next)
        }
    }

    for (let i = 0; i < _stack.length; i++) {
        _stack[i](req, res, next)
    }

    return {
        req, res
    }
}

// Add middleware to stack
function use(fn, index) {
    if (typeof index === 'number') {
        stack.splice(index, 0, fn)
    } else {
        stack.push(fn)
    }
}

module.exports = {
    run,
    use
}