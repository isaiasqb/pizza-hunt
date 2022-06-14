const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Schema defining the fields with specific data types, using the Schema constructor imported. 
const PizzaSchema = new Schema ({
  pizzaName: {
    type: String
  },
  createdBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal)
  },
  size: {
    type: String,
    default: 'Large'
  },
  toppings: [],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
},
//tell the schema that it can use virtuals and getters.
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);


//get total count of comments and replies on retrieval
PizzaSchema.virtual('CommentCount').get(function(){
  return this.comments.lenght;
});


// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the pizza model
module.exports = Pizza;