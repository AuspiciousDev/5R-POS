const Sale = require("../model/Sale");

const saleController = {
  createSale: async (req, res) => {
    let emptyFields = [];
    try {
      const { transactor, items, totalSum } = req.body;
      console.log(
        "🚀 ~ file: SaleController.js:8 ~ createSale: ~ req.body;",
        req.body
      );

      if (!transactor) emptyFields.push("transactor");
      if (!items) emptyFields.push("transactor");
      if (!totalSum) emptyFields.push("totalSum");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const productObject = {
        transactor,
        items,
        totalSum,
      };

      const createProduct = await Sale.create(productObject);
      res.status(201).json(createProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllSale: async (req, res) => {
    try {
      const transaction = await Sale.find().sort({ createdAt: -1 }).lean();
      if (!transaction)
        return res.status(204).json({ message: "No transaction Found!" });
      res.status(200).json(transaction);
    } catch (error) {
      console.log(
        "🚀 ~ file: SaleController.js:46 ~ getAllSale: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getSale: async (req, res) => {
    if (!req?.params?.transactionID)
      return res.status(400).json({ message: `Transaction ID is required!` });
    if (req.params.transactionID.length !== 24) {
      return res.status(400).json({ message: `Invalid Transaction ID!` });
    }

    const transactionID = req.params.transactionID;
    try {
      const transaction = await Sale.find({ transactionID }).exec();
      if (transaction.length == 0)
        return res.status(204).json({ message: "Transaction ID not Found!" });
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  patchSale: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteSale: async (req, res) => {
    if (!req?.params?.transactionID)
      return res.status(400).json({ message: `Transaction ID is required!` });
    if (req.params.transactionID.length !== 24) {
      return res.status(400).json({ message: `Invalid Transaction ID!` });
    }
    const transactionID = req.params.transactionID;
    try {
      const transaction = await Sale.findOne({ transactionID }).exec();
      if (!transaction)
        return res.status(204).json({ message: "Transaction ID not found!" });
      const deleteItem = await transaction.deleteOne({ transactionID });
      res.json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: SaleController.js:80 ~ deleteSale: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = saleController;
