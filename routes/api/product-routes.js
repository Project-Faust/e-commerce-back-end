const router = require('express').Router();
const { Product, Tag, ProductTag, Category } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Product and Tag data
  try {
    // find all products
    const productDataAll = await Product.findAll({
      // indlude model data for Category and Tag
      include: [
        { model: Category },
        { model: Tag }
      ]
    })
    // return results
    res.status(200).json(productDataAll);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Product and Tag data
  try {
    const productDataId = await Product.findByPk(req.params.id, {
      // indlude model data for Category and Tag
      include: [
        { model: Category },
        { model: Tag }
      ]
    })
    // return 404 if product not found
    if (!productDataId) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    // return results
    res.status(200).json(productDataId);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const productNew = await Product.create(req.body);
    return res.status(200).json({ message: 'Product created successfully.' })
  } catch (error) {
    res.status(500).json(error)
  }

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // find target Product
    const productId = req.params.id;
    const productDelete = await Product.findByPk(productId);
    // return 404 if Product not found
    if (!productDelete) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    // destroy Product
    await Product.destroy({
      where: {
        id: productId
      }
    });
    res.status(200).json({ message: 'Product deleted successfully.' })
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
