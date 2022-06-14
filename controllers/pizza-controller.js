const { Pizza } = require('../models');

const pizzaController = {
  //GET all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  //GET pizza by ID
  getPizzaById({ params }, res) {
    Pizza.findOne({_id: params.id })
    .then(dbPizzaData => {
      //if nop pizza is found send 404
      if(!dbPizzaData) {
        res.status(404).json({message: 'No pizza foound with this id!'});
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => {
      consaole.log(err);
      res.status(400).json(err);
    });
  },

  //CREATE a pizza 
  createPizza({ body }, res) {
    Pizza.create(body)
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.status(400).json(err));
  },

  //UPDATE pizza by id
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
    .then(dbPizzaData => {
      if(!dbPizzaData) {
        res.status(404).json({ message: 'No Pizza found with this ID!'});
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.status(400).json(err));
  },

  //DELETE pizza by the id
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
}
};

module.exports = pizzaController;