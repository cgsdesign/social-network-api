const { User, Thought } = require('../models');


const userController = {
    //same as .GETs
    // get all users
    getAllUser(req, res) {
      User.find({})
      .populate({//this is to make thoughts populate
        path: 'thoughts',
        select: '-__v'//if we dont have this line it would return only __v field
      })
      .select('-__v')
      .sort({ _id: -1 })//sort new to old
      .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one user by id
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({//this is to make thoughts populate
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
          // If no user is found, send 404
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    // createUser // same as .POST
    createUser({ body }, res) {
        console.log(body)
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

  //same as .PUT
  // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            return Thought.deleteMany(
              {_id: {$in: dbUserData.thoughtId }}
            )
            //res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    //-----------------------_FRIENDS
    //--------------------add friend---------------------------//
    addFriend({ params }, res) {
      User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId  } },
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
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends:  params.friendId  } },
          //$pull removes all that match query
          { new: true
          }
        )
          .then(dbData => res.json(dbData))
          .catch(err => res.json(err));
      }






  }

module.exports = userController;