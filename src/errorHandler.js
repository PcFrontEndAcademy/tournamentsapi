module.exports = function (error, request, response, next) {
    return response.status(error.output.statusCode)
        .json(error.output.payload);
}