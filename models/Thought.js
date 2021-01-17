const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


//reaction schema
const ReactionSchema = new Schema(
    {
      // set custom id to avoid confusion with parent comment's _id field
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionText: {
        type: String,
        required: 'Reaction is Required',
        max: 280
      },
      username: {
        type: String,
        required: 'Username is Required'
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
      toJSON: {
        getters: true
      }
    }
  );



//attach reactionSchema once made
const ThoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: 'Text is Required',
        min: [1, "make a thought"],
        max: [280, "thought is too long"],
      },
      username: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
      },
      reactions: [ReactionSchema],
      //reactionCount: [ThoughtSchema]
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
    }
  );

  ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });


const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;