// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add',(req, res, next) => {
     /*****************
     * ADD CODE HERE *
     *****************/
    res.render('books/details',{
    title:'Add a book',
    books:{
      Title:'',
      Price:'',
      Author:'',
      Genre:''
    }


    })
    
    });


// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
   
      let newBook = book({
        "Title":req.body.title,
        "Price":req.body.price,
        "Author":req.body.author,
        "Genre":req.body.genre        
    })

    newBook.save((err)=>{
      if(err){
       return console.log(err);
      }else{
        res.redirect('/books')
      }
    })
   

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
   
    const bookId = req.params.id;

    // Check if the bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send('Invalid book ID');
    }
  
    // Find the book by its ID
    book.findById(bookId, (err, foundBook) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while retrieving the book');
      }
  
      if (!foundBook) {
        return res.status(404).send('Book not found');
      }
  
      // Render the book details page with the found book
      res.render('books/details', {
        title: 'Book Details',
        books: foundBook
      });
    });
   
   
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let bookId= req.params.id;
    let {title, price, author, genre} =req.body;
    // Find and delete a document by id using findByIdAndDelete
    book.findByIdAndUpdate(
      bookId,{
        Title:title,
        Price:price,
        Author:author,
        Genre:genre
      },(err, book)=>{
        if(err){
          return console.error(err);
        }else{
          res.redirect('/books');
        }
      }
    )
  

});

// GET - process the delete by user id  
router.get('/delete/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let bookId = req.params.id;

  // Check if the bookId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).send('Invalid book ID');
  }

  // Find the book by its ID and remove it
  book.findByIdAndRemove(bookId, (err, deletedBook) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while deleting the book');
    }

    if (!deletedBook) {
      return res.status(404).send('Book not found');
    }

    // Redirect to the books list page after successful deletion
    res.redirect('/books');
  });  
   
  });



module.exports = router;
