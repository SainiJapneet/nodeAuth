const jwt = require("jsonwebtoken");
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();


const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');


dbConnect()

//cors error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods","POST, GET, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.use(express.json())


app.use(express.urlencoded({ extended: true }))


app.post("/register", (request, response) => {

    console.log(request.body)

    bcrypt.hash(request.body.password, 10)
        .then((hashedPassword) => {
            console.log('hashedPassword', hashedPassword)

            
            const user = new User({
                email: request.body.email,
                password: hashedPassword
            })


            user.save()
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        result
                    })
                })
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



app.post("/login", (request, response) => {

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

                    const token = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    }, "RANDOM-TOKEN", { expiresIn: "24h" })


                    response.status(200).send({
                        message: "Login successful",
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