const _ = require('lodash');

const { User } = require('../models/user');

const login = async (req, res) => {
  try{
    const body = _.pick(req.body, ['email', 'password']);

    const input = body.email && body.password;
    const validation = body.email === '' || body.password === '';

    if(!input || validation){
      throw new Error("[email, password] must be provided and can not be empty");
    }

    const user = await User.findByCredentials(body.email, body.password);

    const authToken = await user.generateAuthToken(); 

		res.header('x-auth', authToken).status(200).send({
			status: "success",
	    data: {
	    	token: authToken
	    }
		});
  }catch(error) {
		res.status(400).send({
			status: "error",
	    data: error.message
		});
  }
}

const register = async (req, res) => {
  try{
    const body = _.pick(req.body, ['email', 'name', 'password']);

    const input = body.email && body.password && body.name;
    const validation = body.email === '' || body.password === ''|| body.name === '';

    if(!input || validation){
      throw new Error("[email, password, name] must be provided and can not be empty");
    }

    const user = new User(body);
    const result = await user.save();

    const authToken = await user.generateAuthToken(); 

		res.header('x-auth', authToken).status(201).send({
			status: "success",
	    data: {
	    	user: result,
	    	token: authToken
	    }
		});

  }catch(error) {
		res.status(400).send({
			status: "error",
	    data: error.message
		});
  }
}

module.exports = { login, register }