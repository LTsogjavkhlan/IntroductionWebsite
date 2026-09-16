// Wraps an async Express route handler so a rejected promise is forwarded to
// next(err) instead of crashing the process (Express 4 doesn't do this automatically).
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
