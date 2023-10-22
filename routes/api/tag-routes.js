const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// PUT (update) a tag by ID
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowCount] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedRowCount === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    const updatedTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    res.json(updatedTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// DELETE a tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedRowCount === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json(deletedRowCount);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
