const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooksUsingPromise = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://vimalam242-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/') 
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getBookDetailsByISBNUsingPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`) 
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getBookDetailsByAuthorUsingPromise = (author) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`) 
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getBookDetailsByTitleUsingPromise = (title) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`) 
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getBooksUsingAsyncAwait = async () => {
    try {
        const response = await axios.get('https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookDetailsByISBNUsingAsyncAwait = async (isbn) => {
    try {
        const response = await axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookDetailsByAuthorUsingAsyncAwait = async (author) => {
    try {
        const response = await axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookDetailsByTitleUsingAsyncAwait = async (title) => {
    try {
        const response = await axios.get(`https://vimalam242-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

public_users.get('/promise', (req, res) => {
    getBooksUsingPromise()
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

public_users.get('/async', async (req, res) => {
    try {
        const books = await getBooksUsingAsyncAwait();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

public_users.get('/isbn/:isbn/promise', (req, res) => {
    const isbn = req.params.isbn;
    getBookDetailsByISBNUsingPromise(isbn)
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

public_users.get('/isbn/:isbn/async', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const books = await getBookDetailsByISBNUsingAsyncAwait(isbn);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

public_users.get('/author/:author/promise', (req, res) => {
    const author = req.params.author;
    getBookDetailsByAuthorUsingPromise(author)
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

public_users.get('/author/:author/async', async (req, res) => {
    try {
        const author = req.params.author;
        const books = await getBookDetailsByAuthorUsingAsyncAwait(author);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

public_users.get('/title/:title/promise', (req, res) => {
    const title = req.params.title;
    getBookDetailsByTitleUsingPromise(title)
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

public_users.get('/title/:title/async', async (req, res) => {
    try {
        const title = req.params.title;
        const books = await getBookDetailsByTitleUsingAsyncAwait(title);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

    // Obtain all the keys for the ‘books’ object
    const bookKeys = Object.keys(books);

    // Iterate through the ‘books’ array & check if the author matches the one provided in the request parameters
    for (const key of bookKeys) {
        if (books[key].author === author) {
            booksByAuthor.push( {
                isbn: key, 
                title: books[key].title,
                reviews: books[key].reviews
            }
               );
        }
    }

    if (booksByAuthor.length > 0) {
        res.json({ booksByAuthor: booksByAuthor });
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
  
      // Obtain all the keys for the ‘books’ object
      const bookKeys = Object.keys(books);
  
      // Iterate through the ‘books’ array & check if the author matches the one provided in the request parameters
        for (const key of bookKeys) {
        if (books[key].title === title) {
            booksByTitle.push( {
                isbn: key, 
                author: books[key].author,
                reviews: books[key].reviews
            }
               );
        }
    }
  
      if (booksByTitle.length > 0) {
          res.send({booksbytitle: booksByTitle})
      } else {
          res.status(404).json({ message: "No books found with this title" });
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found or no reviews available" });
    }
});

module.exports.general = public_users;localStoragels
