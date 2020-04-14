console.log("saved.js loaded.");

// request all saved articles from the database
$.get("/api/saved", function (data, err) {
    if (err) {
        console.log(err);
    }
    //console.log(data);
    data.forEach(article => {
        let newArticle = $("#template").clone().removeAttr("id").removeAttr("hidden");
        newArticle.children("article").attr("data-id", article._id);
        newArticle.children("article").attr("data-headline", article.headline);
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

// click event for "view comments" button on an article
$(document).on("click", ".view-comments-btn", function () {
    console.log("view comments button clicked");
    let id = $(this).closest("article").attr("data-id");
    let headline = $(this).closest("article").attr("data-headline");
    $("#commentsModalTitle").text(`Comments for "${headline}"`);
    $("#save-comment-btn").attr("data-id", id);

    loadComments(id);

    $("#commentsModal").modal('show');
});

function loadComments(id) {
    // clear all comments except for the template
    $("#comments-list").children("[id!='comment-template']").remove();
    // GET comments for this article and populate them in the modal
    $.get('/api/articles/' + id, function (data, err) {
        if (err) {
            console.log(err);
        }
        //console.log(data);
        data.comments.forEach(comment => {
            console.log(comment.date);
            let newComment = $("#comment-template").clone()
                .removeAttr("id")
                .removeAttr("hidden")
                .attr("data-id", comment._id);
            let commentDate = new Date(parseInt(comment.date));
            console.log(commentDate.toString());
            newComment.children("p").html(`<span>${formatDate(commentDate)}</span> ${comment.body}`)
            newComment.children(".delete-comment-btn").hide();
            $("#comments-list").append(newComment);
        });
    });
}

function formatDate(date) {
    return moment(date).format('M.D.YYYY, h:mma'); 
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

$(document).on("click", ".delete-comment-btn", function () {
    let articleId = $("#save-comment-btn").attr("data-id");
    let commentId = $(this).parent().attr("data-id");
    console.log(`comment ${commentId} clicked`);
    $.ajax({
        type: 'DELETE',
        url: '/api/comments/' + commentId,
    }).done(data => {
        console.log(data);
        loadComments(articleId);
    });
});

// show delete button on comment mouseover
$(document).on("mouseover", ".comment", function () {
    $(this).children(".delete-comment-btn").show();
});

// hide delete button on comment when mouse leaves
$(document).on("mouseleave", ".comment", function () {
    $(this).children(".delete-comment-btn").hide();
});

// click event for fav heart on each article
// all articles on this page are favorites, so we will be un-favoriting it here
$(document).on("click", "i", function () {
    let id = $(this).closest("article").attr("data-id");
    let isFav = true;
    $.ajax({
        type: 'PUT',
        url: '/api/favorite/' + id,
        data: { favorite: !isFav }
    }).done(data => {
        // remove article from Favorites page
        $(this).closest(".article-col").remove();
    });
});