# reWIRED

**Your news, your way!** *reWIred* allows you to bookmark your favorite WIRED.com articles for later reading -- AND attach your own notes and comments to each article.

Try it! [rewired-scraper.herokuapp.com](http://rewired-scraper.herokuapp.com)

## Introduction

*reWIRED* is a full-stack app created using Node.js, the Express web application framework, MongoDB, and Handlebars. It also functions as a simple demonstration of the MVC (Model / View / Controller) design pattern.

### Using reWIRED
- Each time you visit the main page of the app, it scrapes article information from WIRED.com and displays a summary and link for each article.
- To save an article as a favorite, click the ♡ icon. A solid white heart indicates that the article is a favorite.
- To view your favorites, click the *Favorite Articles* link in the navigation bar. This will load a new page with only the articles that have been favorited.
- To view and manage the comments associated with an article, click the *View comments* button below the article. A modal window will open showing any existing comments.
- To add a comment, enter it in the input blank and click the *Save comment* button.
- To delete a comment, mouse over the comment to be deleted. A red ✖ will appear over the comment. Click the ✖ to delete the comment.

**NOTE:** In the interest of a simple demonstration of the app's capability, this app does not use any user authentication. So remember: anybody can add articles to Favorites, and anyone can read and/or delete your comments!

### NPM packages used
- [express](https://www.npmjs.com/package/express) - A fast, unopinionated, minimalist web framework for Node.js.
- [express-handlebars](https://www.npmjs.com/package/express-handlebars) - A Handlebars view engine for Express which doesn't suck.
- [axios](https://www.npmjs.com/package/axios) - A promise-based HTTP client for the browser and Node.js.
- [cheerio](https://www.npmjs.com/package/cheerio) - A fast, flexible & lean implementation of core jQuery designed specifically for the server.
- [mongoose](https://www.npmjs.com/package/mongoose) - A MongoDB object-modeling tool designed to work in an asynchronous environment.

## The author

This app was written from the ground up by **Todd F. Bartelt** as part of the Full-Stack Web Development program at University of Kansas Professional and Continuing Education. Learn more about Todd at [toddbartelt.com](http://toddbartelt.com).