const { Schema, model } = require('mongoose');

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
    default: Date.now
  },
  size: {
    type: String,
    default: 'Large'
  },
  toppings: []
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the pizza model
module.exports = Pizza;