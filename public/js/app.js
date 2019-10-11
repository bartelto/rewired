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

// click event for fav heart on each article
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
