const chapterContainer = document.getElementById("table-of-content");

function getAllChapter() {
    if (localStorage["current-read-book"] != null) {
        var bookUrl = 'http://localhost:8080/get';
        bookUrl += '?bcode=' + localStorage["current-read-book"];
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: bookUrl,
            success: function(data) {
                renderChapter(data)
            }})
    }
}

function renderChapter(data) {
    var bookName = data.bookName;
    var authorName = data.authorName;
    var chapterList = data.chapterList;
    let html = "";

    html += "<div class='book-detail'>" +
        "<h1>" + bookName + "</h1>" +
        "<h2>" + authorName + "</h2>" +
        "</div>" +
        "<div class='chapter-title'>" +
        "<h3 class='table-of-content'>Table of contents</h3>";

    for(var i = 0; i < chapterList.length; i++) {
        var openChapter = "openChapter(" + chapterList[i].index + ")";
        var chapterTitle = chapterList[i].title;
        html += "<p><a href='reader.html' onclick='" + openChapter +"'> Chapter " + chapterList[i].index + ": " + chapterTitle + "</a></p>"
    }

    html += "</div>";
    chapterContainer.innerHTML += html;
}

function openChapter(currentChapter) {
    window.localStorage.setItem("current-read-book-chapter", currentChapter)
    window.location.href = "reader.html";
}

getAllChapter();

