const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      await newProduct.addTags(req.body.tagIds);
      const productWithTags = await Product.findByPk(newProduct.id, {
        include: [Category, { model: Tag, through: ProductTag }],
      });
      res.status(201).json(productWithTags);
    } else {
      res.status(201).json(newProduct);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// PUT (update) a product by ID
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowCount] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedRowCount === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.body.tagIds) {
      const product = await Product.findByPk(req.params.id);
      if (product) {
        await product.setTags(req.body.tagIds);
      }
    }

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedRowCount === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(deletedRowCount);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
