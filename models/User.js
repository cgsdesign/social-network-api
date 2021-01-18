const { Schema, model, Types } = require('mongoose');
//const dateFormat = require('../utils/dateFormat');


const UserSchema = new Schema({
      username: {
        type: String,
        trim: true,
        unique: [true, 'that username is taken'],
        required: true
      },
      email: {
        type: String,
        unique:[true, "that email is taken"],
        match: [/.+\@.+\..+/, 'not valid email'],
        required:true
      },
      // usercreate: {
      //   type: Date,
      //   default: Date.now
      // },
      friends: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
            //username:    [ this ]
        }
      ],
      thoughts: [
          {
              type: Schema.Types.ObjectId,
              ref: 'Thought',
              username:    [ this ]
          }
      ],
      ///friendCount: [UserSchema]
  },
    {
      toJSON: {
        getters: true,
        vertual: true
      }
    }
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// create the User model using the UserSchema above
const User = model('User', UserSchema);

// export the User model
module.exports = User;