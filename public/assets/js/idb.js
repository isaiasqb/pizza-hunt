//variable created to hold the connection
let db;
//establish a connection to indexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
  // save a =reference to the database
  const db = event.target.result;
  //create an object store (table) called 'new pizza, set it to have an auto incrementing primary key oof sorts
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function(event) {
  //when db is successfully created with its object store (from onupgradeneeded) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  //check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(event) {
  //log error here
  console.log(event.target.errorCode);
};


//this function will be executed   if we attempt to submit a new pizza and there is no internet connection
function saveRecord(record) {
  //open a new transaction with the database with read and write permissions
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  //access the object store for 'new pizza'
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  //add record to your store with add method
  pizzaObjectStore.add(record);
}


//function that will handle collecting all of the data from the new_pizza object store in IndexedDB and POST it to the server
function uploadPizza() {
  //open a transaction in yiur db
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  //access your object store
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  //get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon an unsuccessfull getAll exacution, run this function
  getAll.onsuccess = function() {
    // if there was data in indexedDB's store, let's send it to the api server
    if(getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        }
      })
      .then(response => response.json())
      .then(serverResponse => {
        if (serverResponse.message){
          throw new Error(serverResponse);
        }
        //open one more transaction 
        const transaction = db.transaction(['new_pizza'], 'readwrite');
        //access the new_pizza object store
        const pizzaObjectStore = transaction.objectStore('new_pizza');
        //clear all items in your store
        pizzaObjectStore.clear();

        alert.apply('All saved pizza has been submitted')
      })
      .catch(err => {
        console.log(err);
      })
    }
  };
}


// listen for app coming back online
window.addEventListener('online', uploadPizza);