const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
	try {
		res.json(await Product.find());
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getRandom = async (req, res) => {
	try {
		const count = await Product.countDocuments();
		const rand = Math.floor(Math.random() * count);
		const dep = await Product.findOne().skip(rand);
		if (!dep) res.status(404).json({ message: 'Not found' });
		else res.json(dep);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getById = async (req, res) => {
	try {
		const dep = await Product.findById(req.params.id);
		if (!dep) res.status(404).json({ message: 'Not found' });
		else res.json(dep);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.add = async (req, res) => {
	try {
		const { name } = req.body;
		const newProduct = new Product({ name: name });
		await newProduct.save();
		res.json({ message: 'OK' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.editById = async (req, res) => {
	const { name, client } = req.body;
	try {
		const dep = await Product.findById(req.params.id);
		if (dep) {
			await Product.updateOne({ _id: req.params.id }, { $set: { name, client } });
			res.json({ message: 'OK' });
		} else res.status(404).json({ message: 'Not found...' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.deleteById = async (req, res) => {
	try {
		const dep = await Product.findById(req.params.id);
		if (dep) {
			await Product.deleteOne({ _id: req.params.id });
			res.json({ message: 'OK' });
		} else res.status(404).json({ message: 'Not found...' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};
