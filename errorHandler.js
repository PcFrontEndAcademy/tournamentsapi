module.exports = function handleError(error, _request, response) {
    return response.status(error.output.statusCode)
        .json(error.output.payload);
};
