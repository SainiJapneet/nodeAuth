const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//we will use this to hash the password that we recieve from users

const app = express();


//require a darabase connection
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');


//execute database connection
dbConnect()

app.use(express.json())
//adds middleware to your app
//it parses incoming requestes to JSON


app.use(express.urlencoded({ extended: true }))
//parses incoming requests with URL encoded payloads

//include data => the body of the request
//or using URL encoded data ex HTML form data



app.get('/', (request, response, next) => {
    response.json({
        message: "Hey!, This is your server response"

    })
    next();
})



//register endpoint

//.then ,  .catch, .finally

app.post("/register", (request, response) => {

    console.log(request.body)

    bcrypt.hash(request.body.password, 10)
        .then((hashedPassword) => {
            console.log('hashedPassword', hashedPassword)

            //create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword
            })

            //save the user
            user
                .save()
                //return success if the new user is added to the database successfully
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        result
                    })
                })
                //catch error if the new user was not added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error
                    })
                })

        }).catch((error) => {
            response.status(500).send({
                message: "Password was not hashed successfully"+error,
                error
            })
        })

})


//login endoint

app.post("/login", (request, response) => {
    //check if the email tha user enters omn login exists or not

    User.findOne({ email: request.body.email })
        .then((user) => {
            console.log(user)

            bcrypt.compare(request.body.password, user.password)
                .then((passwordCheck) => {
                    console.log(passwordCheck)

                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: 'Passwords do not match'
                        })
                    }

                    // create a jwt token
                    const token = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    }, "RANDOM-TOKEN", { expiresIn: "24h" })

                    //return a success response

                    response.status(200).send({
                        message: "Login is successsfull",
                        email: user.email,
                        token,
                    })
                })
                .catch(err => {
                    response.status(400).send({
                        message: 'Passwords do not match',
                        err
                    })
                })

        })
        .catch((err) => {
            response.status(404).send({
                message: "Email not found",
                err
            })
        })

})





module.exports = app;