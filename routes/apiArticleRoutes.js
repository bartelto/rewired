var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

  // A GET route for scraping the WIRED website and returning 
  app.get("/api/articles", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.wired.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".card-component").each(function (i, element) {
        // Save an empty result object
        var result = {};

        result.headline = $(this)
          .find(".card-component__description")
          .find("h2")
          .text();
        result.category = $(this)
          .find(".card-component__description")
          .find(".brow-component")
          .children()
          .text();
        result.url = $(this)
          .find(".card-component__description")
          .children("a")
          .attr("href");
        result.image = $(this)
          .find(".card-component__image")
          .find("img")
          .attr("src");
        result.dateAdded = Date();

        // author requires special handling, since there could be more than one
        let authorArray = [];
        $(this)
          .find(".card-component__description")
          .find(".byline-component")
          .find("a")
          .each(function(index, obj) {
            authorArray.push($(this).text());
          });
        result.author = authorArray.join(" & ");

        //console.log(result);

        db.Article.findOne({ url: result.url })
          .catch(function (err) {
            // If an error occurred, no matching Articles were found.
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
              });
          });

      });

      // Send a message to the client
      //res.send("Scrape Complete");

      // Grab every document in the Articles collection
      db.Article.find({})
        .sort({dateAdded: 'desc'})
        .then(function (dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
  });

  // Route for getting all SAVED Articles from the db
  app.get("/api/saved", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ favorite: true })
      .sort({dateAdded: 'desc'})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for favoriting/unfavoriting a specific Article by id
  app.put("/api/favorite/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query to update the specified Article
    db.Article.updateOne({ _id: req.params.id }, { favorite: Boolean(req.body.favorite === 'true') })
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        console.log("success");
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populated with its comments
  app.get("/api/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the comments associated with it
      .populate("comments")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Comment
  app.post("/api/articles/:id", function (req, res) {
    console.log("adding a comment");
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function (dbComment) {
        // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. 
        // Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // route for deleting a comment
  app.delete("/api/comments/:id", function (req, res) {
    console.log('Got a DELETE request for comment ' + req.params.id);
    db.Comment.deleteOne({ _id: req.params.id })
      .then(function (dbComment) {
        // If we were able to successfully find a Comment with the given id, send it back to the client
        res.json(dbComment);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

};
