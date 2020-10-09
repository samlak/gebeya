const fs = require('fs');
const _ = require('lodash');
const multer = require('multer');
const path = require('path');

const { Item } = require('../models/item');

const allItems = async (req, res) => {
	try {
		let items;
		let previousPage;
	  let	currentPage;
	  let	nextPage;

		const resultPerPage = 10;
		const totalItems = await Item.find().countDocuments();
		const totalPage = Math.ceil(totalItems / resultPerPage);

		if(req.query.page && req.query.page > 0) {
			const pageNum = parseInt(req.query.page);

			if(req.query.sort){
				items = await Item.find()
					.skip((resultPerPage * pageNum) - resultPerPage)
					.limit(resultPerPage)
					.sort({price: req.query.sort});
			}else {
				items = await Item.find()
					.skip((resultPerPage * pageNum) - resultPerPage)
					.limit(resultPerPage);
			}

			previousPage = ((pageNum - 1 === 0) ? null : "?page="+(pageNum - 1));
			currentPage = "?page=" + pageNum;
			nextPage = ((pageNum + 1 <= totalPage) ? "?page="+(pageNum + 1) : null );

			if(req.query.page > totalPage) {
				items = "No item found for this page";

				previousPage = null;
				currentPage = null;
				nextPage = null;
			}
		} else {
			if(req.query.sort){
				items = await Item.find()
					.limit(resultPerPage)
					.sort({price: req.query.sort});
			} else {
				items = await Item.find()
					.limit(resultPerPage);
			}

			previousPage = null;
			currentPage = "?page=1";
			nextPage = (2 <= totalPage ? "?page=2" : null);
		}

		res.status(200).send({
			status: "success",
	    data: items,
	    pagination: {
	    	previousPage, 
	    	currentPage,
	    	nextPage,
	    	totalPage
	    }
		});

	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: "Error fetching from database"
		});
	}
}

const individualItem =  async (req, res) => {
	try {
		await Item.findOne({_id: req.params.id})
		.then(result => {
			if (!result) {
				res.status(404).send({
					status: "error",
			    data: "Item canot be found"
				});
			}

			res.status(200).send({
				status: "success",
		    data: result
			});
		});
		

	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: "Error fetching from database"
		});
	}
}

const addItem =  async (req, res) => {
	try {
    const body = _.pick(req.body, ['name', 'description', 'vendor', 'price']);
    const input = body.name && body.description && body.vendor && body.price;
    const validation = body.name === '' || body.description === '' || body.vendor === '' 
    			|| body.price === '';

    if(!input || validation){
      throw new Error("[name, description, vendor, price] must be provided and can not be empty");
    }

    const item = new Item(body);

    await item.save().then(result => {
    	res.status(201).send({
				status: "success",
		    data: result,
			});
    });

	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: error.message
		});
	}
}

const updateItem =  async (req, res) => {
	try {
    const body = _.pick(req.body, ['name', 'description', 'vendor', 'price']);

    await Item.findByIdAndUpdate(
      req.params.id,
      {$set: body},
      { useFindAndModify: false, new: true }
    ).then((result) => {
    	res.status(200).send({
				status: "success",
		    data: result,
			});
    });
	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: "Oops! Item update failed"
		});
	}
}

const deleteItem =  async (req, res) => {
try {
		await Item.findByIdAndRemove(
			req.params.id,
    	{useFindAndModify: false}
		).then((item) => {
			console.log(item);
			if(item.photo) {
				fs.unlinkSync(path.join(__dirname, '../public/file/', item.photo));
			}
    	res.status(200).send({
				status: "success",
		    data: "Item removed successfully",
			});
  	});
	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: error.message
		});
	}
}

const uploadImage =  async (req, res) => {
	try {
		await Item.findByIdAndUpdate(
			req.params.id,
			{$set: { photo: req.file.filename }},
    	{useFindAndModify: false}
		).then((item) => {
			if(!item){
				fs.unlinkSync(path.join(__dirname, '../public/file/', req.file.filename));
				throw new Error("Item with this ID cannot be found")
			}
			if(item.photo) {
				fs.unlinkSync(path.join(__dirname, '../public/file/', item.photo));
			}
    	res.status(200).send({
				status: "success",
		    data: "Photo uploaded successfully",
			});
  	});
	} catch (error) {
		res.status(400).send({
			status: "error",
	    data: error.message
		});
	}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/file');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}

const multerFunction = multer({ storage, fileFilter });

module.exports = { allItems, individualItem, addItem, updateItem, deleteItem, uploadImage, multerFunction }