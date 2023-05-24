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
    // return 404 if category not found
    if (!categoryDataID) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).json(categoryDataID);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    await Category.create(req.body);
    res.status(200).json({ message: 'Category created successfully.' });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a category by its `id` value
    const category = await Category.findByPk(req.params.id);
    // return 404 if category not found
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    // Update the category' name with response body
    category.category_name = req.body.category_name;
    // save updated category name
    await category.save();
    // send back updated category
    res.status(200).json({ message: 'Category updated successfully.' });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // find target category
    const categoryId = req.params.id;
    const categoryDelete = await Category.findByPk(categoryId);
    // return 404 if category not found
    if (!categoryDelete) {
      return res.status(404).json({ error: 'Category not found' });
    }
    // destroy category
    await Category.destroy({
      where: {
        id: categoryId
      }
    });
    res.status(200).json({ message: 'Category deleted successfully.' })
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
