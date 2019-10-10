console.log("saved.js loaded.");

// request all saved articles from the database
$.get("/api/saved", function (data, err) {
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

// click event for "add comment" button
$(document).on("click", ".add-comment-btn", function () {
    console.log("comment button clicked");
    let id = $(this).closest("article").attr("data-id");
    $("#commentsModalTitle").text("Comments for " + id);
    $("#save-comment-btn").attr("data-id", id);

    loadComments(id);

    $("#commentsModal").modal('show');
});

function loadComments(id) {
    $("#comments-list").children("[id!='comment-template']").remove();
    // GET comments for this article and populate them in the modal
    $.get('/api/articles/' + id, function (data, err) {
        if (err) {
            console.log(err);
        }
        console.log(data);
        data.comments.forEach(comment => {
            console.log(comment.body);
            let newComment = $("#comment-template").clone().removeAttr("id").removeAttr("hidden");
            newComment.text(comment.body)
                .attr("data-id", comment._id);
            $("#comments-list").append(newComment);
        });
    });
}

$("#save-comment-btn").click(function () {
    let id = $(this).attr("data-id");
    console.log("saving new comment for article " + id);

    $.ajax({
        type: 'POST',
        url: '/api/articles/' + id,
        data: { body: $("#new-comment").val().trim() }
    }).done(data => {
        loadComments(id);
        $("#new-comment").val("");
    });
});

$(document).on("click", ".comment", function() {
    let articleId = $("#save-comment-btn").attr("data-id");
    let commentId = $(this).attr("data-id");
    console.log(`comment ${commentId} clicked`);
    $.ajax({
        type: 'DELETE',
        url: '/api/comments/' + commentId,
    }).done(data => {
        console.log(data);
        loadComments(articleId);
    });
});