const jwt = require('jsonwebtoken');


//create an export asynchronous function in which we will write our authoriasation logic

module.exports = async (request, response, next) => {
    try {
        //get the token from authorization header

        // console.log(request.headers)
        const token = await request.headers.authorization.split(" ")[1];

        // console.log(token)

        //check if the token matches the origin

        const decodedToken = jwt.verify(token, "RANDOM-TOKEN")

        // console.log(decodedToken)
        //retireve the user details of the logged in user
        const user = decodedToken;

        //pass the user down to the protected endpoints 

        request.user = user;

        //pass down functionality to the endpoint
        next();


    } catch (error) {
        response.status(401).json({
            error: new Error("Invalid Request")
        })
    }
}