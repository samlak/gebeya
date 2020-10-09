const { User } = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.headers['x-auth'];

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
    
        next();
    }).catch((error) => { 
        res.status(400).send({
            status: "error",
            data: "Oops! Authentication failed"
        });
    });

};

module.exports = {authenticate}