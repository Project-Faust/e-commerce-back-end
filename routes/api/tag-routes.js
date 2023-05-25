const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagDataAll = await Tag.findAll({
      include: { model: Product }
    })
    res.status(200).json(tagDataAll);
  } catch (error) {
    res.status(500).json(error)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagDataId = await Tag.findByPk(req.params.id, {
      include: {
        model: Product
      }
    });
    if (!tagDataId) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    res.status(200).json(tagDataId);
  } catch (error) {
    res.status(500).json(error);
  }

});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    await Tag.create(req.body);
    res.status(200).json({ message: 'Tag created successfully.' })
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagUpdate = await Tag.findByPk(req.params.id);
    if (!tagUpdate) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    tagUpdate.tag_name = req.body.tag_name;
    await tagUpdate.save();
    res.status(200).json({ message: 'Tag updated successfully.' })
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    // find target tag
    const tagId = req.params.id;
    const tagDelete = await Tag.findByPk(tagId);
    // return 404 if tag not found
    if (!tagDelete) {
      return res.status(404).json({ error: 'Tag not found.'});
    }
    await Tag.destroy({
      where: {
        id: tagId
      }
    })
    res.status(200).json({ message: 'Tag deleted successfully.'})
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
