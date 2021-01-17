const router = require('express').Router();
const {
    getAllThought,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    removeReaction,
    addReaction
  
  } = require('../../controllers/thought-controller');


  // Set up GET all and POST at /api/thought
router
.route('/')
.get(getAllThought)
.post(addThought);

// Set up GET one, PUT, and DELETE at /api/thought/:id

router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);
  //.put(addReaction);

// POST /api/thought/:thoughtid/reactions
router
.route('/:thoughtId/reaction')
.put(addReaction);

router
.route('/:thoughtId/reaction/:reactionId')
.delete(removeReaction);



module.exports = router;