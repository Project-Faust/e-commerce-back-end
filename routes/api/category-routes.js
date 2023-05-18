const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products.
  try {
    const categoryDataAll = await Category.findAll({ include: [{ model: Product }] });
    res.status(200).json(categoryDataAll);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryDataID = await Category.findByPk(req.params.id, { include: [{ model: Product }] });
    if (!categoryDataID) {
      res.status(404).json({ message: `No category found with ID: ${req.params.id}.` });
    }
    res.status(200).json(categoryDataID);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryNew = await Category.create(req.body);
    res.status(200).json(categoryNew);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryUpdate = await Category.categoryUpdate(req.body, {
      where: {
        id: req.params.id
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryDelete = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
  } catch (error) {
    res.status(500).json(error);
  }

});

module.exports = router;
