console.log("app.js loaded.");

$.get("/api/articles", function(data, err) {
  if (err) {
    console.log(err);
  } 
  console.log(data);
  data.forEach(article => {
    let newArticle = $("#template").clone().removeAttr("id").removeAttr("hidden");
    newArticle.children("article").attr("data-id", article._id);
    newArticle.children("article").attr("data-fav", article.favorite)
      .find("i")
      .removeClass(article.favorite ? "far" : "fas")
      .addClass(article.favorite ? "fas" : "far");
    newArticle.find(".article-headline").text(article.headline);
    newArticle.find(".article-category").text(article.category);
    newArticle.find(".article-author").text(article.author);
    newArticle.find(".card-body").children(".btn-primary").attr("href", "http://www.wired.com" + article.url);
    if (article.image) {
      newArticle.find("img").attr("src", article.image);
    }
    else {
      newArticle.find("img").attr("hidden", true);
    }

    $("#articles").children(".row").append(newArticle);
  });
});

$(document).on("click", "i", function() {
  let id = $(this).closest("article").attr("data-id");
  let isFav = Boolean($(this).closest("article").attr("data-fav") === 'true');
  console.log($(this).closest("article").attr("data-fav"));
  console.log("id" + id + " faved: " + isFav );
  $.ajax({
    type: 'PUT',
    url: '/api/favorite/' + id,
    data: {favorite: !isFav} 
  }).done(data => {
    $(this).toggleClass("far").toggleClass("fas")
  });
});


// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
