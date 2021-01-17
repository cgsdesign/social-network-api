const { Thought, User } = require('../models');

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
    .select('-__v')
    .sort({ _id: -1 })//sort new to old
    .then(dbData => res.json(dbData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .then(dbData => {
        // If no user is found, send 404
        if (!dbData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

    // add thought to user
    addThought({ body }, res) {
        console.log(body);
        Thought.create(body)
          .then(({ _id }) => {
            User.findOneAndUpdate(
              { username: body.username },// .username becasue references User model
              { $push: { thoughts: _id } },
              { new: true }
            )
            return body;

          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
    //----------------------- remove thought
      removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        //when delete also sends back data it dekleted thus why .then(deletedComment => works
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            );//maybe ax
            return deletedThought;
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
//----------------------update thought------------------------//
updateThought({ params, body }, res) {
  Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
  .then(dbData => {
      if (!dbData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
      }
      res.json(dbData);
  })
  .catch(err => res.status(400).json(err));
},      
//--------------------add reaction---------------------------//
      addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true }
        )
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },

//----------------------remove reaction----------------------------//
      // remove reply
      removeReaction({ params }, res) {
          Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            //$pull removes all that match query
            { new: true
            }
          )
            .then(dbData => res.json(dbData))
            .catch(err => res.json(err));
        }
};

module.exports = thoughtController;