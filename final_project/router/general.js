const express = require('express');
let books = require("./booksdb.js");
let booksArrays = Object.values(books);
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username===username
    });
    if (userswithsamename.length > 0){
        return true;
    }else {
        return false;
    }
  }

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4)) 
//   //return res.status(300).json({message: "Yet to be implemented"});
// });
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}
public_users.get('/', async function (req, res) {
    try {
      const bks = await getBooks();
      res.send(JSON.stringify(bks,null,4));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
public_users.get('/',async function (req, res) {
    try{
        const response = await axios.get('https://xiaozhen-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
        res.send(JSON.stringify(response.data,null,4))
    } catch (error) {res.status(500)({message:"Error fetching data from API"})}

  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn
//   res.send(JSON.stringify(books[isbn],null,4)) 
//   //return res.status(300).json({message)
//   //return res.status(300).json({message: "Yet to be implemented"});
//  });
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author
//   let booksFilterbyauthor = booksArrays.filter((booksArray)=>{
//     return booksArray.author === author
//   })
//   if (booksFilterbyauthor.length>0) {
//     res.send(JSON.stringify(booksFilterbyauthor,null,4)) 
//   } else {res.send("No book of auther "+(author))}
//   //return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title
//   let booksFilterbyauthor = booksArrays.filter((booksArray)=>{
//     return booksArray.title === title
//   })
//   if (booksFilterbyauthor.length>0) {
//     res.send(JSON.stringify(booksFilterbyauthor,null,4)) 
//   } else {res.send("No book of title "+(title))}
//   //return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(JSON.stringify(books[isbn].reviews,null,4)) 
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
