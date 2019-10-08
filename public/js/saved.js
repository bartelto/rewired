console.log("saved.js loaded.");

// request all saved articles from the database
$.get("/api/saved", function(data, err) {
  if (err) {
    console.log(err);
  } 
  console.log(data);
  data.forEach(article => {
    let newArticle = $("#template").clone().removeAttr("id").removeAttr("hidden");
    newArticle.children("article").attr("data-id", article._id);
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
