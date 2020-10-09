const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: true, 
		required: true,
		lowercase: true,
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
}, {
	timestamps: true
});


UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

UserSchema.statics.findByToken = function(token) {
	const User = this;
	let decode;
	try{
		decode = jwt.verify(token, process.env.JWT_SECRET)
	}catch(error){
		return Promise.reject();
	}

	return User.findOne({
		'_id': decode._id,
		'tokens.token': token
	})
}

UserSchema.statics.findByCredentials = function(email, password) {
	const User = this;
	return User.findOne({email}).then((user) => {
		if(!user){
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(!res){
					return reject();
				}
				resolve(user);
			});
		});
	});
};

UserSchema.pre('save', function (next) {
	const user = this;
	if(user.isModified('password')){
		bcrypt.genSalt(10, (err,  salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
		
	}else{
		next();
	}
});

UserSchema.pre('findOneAndUpdate', function (next) {
	
	const password = this.getUpdate().$set.password;
	if(!password){
		return next();
	}

	try {
		bcrypt.genSalt(10, (err,  salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				this.getUpdate().$set.password = hash;
				next();
			});
		});
	}catch (error){
		return next(error);
	}
});
const User = mongoose.model('User', UserSchema);

module.exports = {User};