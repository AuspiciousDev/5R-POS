const Restock = require("../model/Restock");

const restockController = {
  createRestock: async (req, res) => {
    let emptyFields = [];
    try {
      const {
        restockBy,
        productID,
        quantity,
        deliveryDate,
        expiredOn,
        supplier,
      } = req.body;
      if (!restockBy) emptyFields.push("restockBy");
      if (!productID) emptyFields.push("productID");
      if (!quantity) emptyFields.push("quantity");
      if (!deliveryDate) emptyFields.push("deliveryDate");
      if (!expiredOn) emptyFields.push("expiredOn");
      if (!supplier) emptyFields.push("supplier");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const restockObj = {
        restockBy,
        productID,
        quantity,
        deliveryDate,
        expiredOn,
        supplier,
      };
      const createRestock = await Restock.create(restockObj);
      res.status(201).json(createRestock);
    } catch (error) {
      console.log(
        "🚀 ~ file: RestockController.js:36 ~ createRestock: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllRestock: async (req, res) => {
    try {
      const restock = await Restock.find().sort({ createdAt: -1 }).lean();
      if (!restock)
        return res.status(204).json({ message: "No Restocks Found!" });
      res.status(200).json(restock);
    } catch (error) {
      console.log(
        "🚀 ~ file: RestockController.js:50 ~ getAllRestock: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getRestock: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid restock _id!` });
    }
    const _id = req.params._id;
    try {
      const restock = await Restock.findOne({ _id }).exec();
      if (!restock)
        return res.status(204).json({ message: "Restock _id not Found!" });
      res.status(200).json(restock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  patchRestock: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid restock _id!` });
    }
    const _id = req.params._id;
    try {
      const product = await Restock.findOne({ _id }).exec();
      if (!product)
        return res.status(204).json({ message: "Restock _id not Found!" });
      const {
        restockBy,
        productID,
        quantity,
        deliveryDate,
        expiredOn,
        supplier,
      } = req.body;
      const update = await Restock.findOneAndUpdate(
        { _id },
        {
          restockBy,
          productID,
          quantity,
          deliveryDate,
          expiredOn,
          supplier,
        }
      );
      if (!update) {
        return res.status(400).json({ error: "Restock update failed!" });
      }
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: RestockController.js:108 ~ patchRestock: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteRestock: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid product _id!` });
    }
    const _id = req.params._id;
    try {
      const _id = req.params._id;
      const restock = await Restock.findOne({ _id }).exec();
      if (!restock)
        return res.status(204).json({ message: "Restock _id not found!" });
      const deleteItem = await restock.deleteOne({ _id });
      res.json(deleteItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = restockController;
