var createChapterButton = document.getElementById("create-chapter-btn");
var bookTitle = document.getElementById("book-title");

bookTitle.insertAdjacentHTML('afterbegin',"<h1> You are editing book : " + localStorage["browsing-book-name"] + "</h1>")

function initializeChapterList() {
        var messageJSON = {
            type: "get-chapter-list",
            bookCode: localStorage["browsing-book-id"]
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            url: 'http://localhost:8080/book',
            data: JSON.stringify(messageJSON),
            success: function(response) {
                localStorage.setItem("number-of-chapters", response.length);
                for(var i = 0; i < response.length; i++) {
                    renderChapter(response[i].index, response[i].title);
                }
            }})
}

function renderChapter(chapterNumber, chapterTitle) {
    var editChapterFunction = "editChapter(" + chapterNumber+ ",\"" + chapterTitle + "\")";
    var changeChapterNameFunction = "changeChapterName(" + chapterNumber + ")";
    var deleteChapterFunction = "deleteChapter(" + chapterNumber + ")";
    createChapterButton.insertAdjacentHTML('beforebegin', "<div>" + chapterNumber + " - " + chapterTitle +
        "<button style=\"left: 1%;position: relative;\" title=\"Change name\" onclick ='" + changeChapterNameFunction + "'> <i class=\"fas fa-feather\"></i></button>" +
        "<button style=\"left: 1.2%; position: relative;\" title=\"Edit\" onclick='" + editChapterFunction  + "'> <i class=\"fas fa-edit\"></i></button>" +
        "<button style=\"left: 1.4%;position: relative;\" title=\"Delete\" onclick='" + deleteChapterFunction  + "'> <i class=\"fas fa-trash\"></i></button></div><br/>");
}

function editChapter(chapterNumber, chapterTitle) {
    localStorage.setItem("browsing-chapter-title", chapterTitle);
    localStorage.setItem("browsing-chapter-num", chapterNumber);
    window.location.href = 'editor.jsp';
}

createChapterButton.onclick = function() {
    var title = prompt("Title of your new chapter");
    var newChapterNumber =+ localStorage["number-of-chapters"] + 1;
    var messageJSON = {
        type: "create-new-chapter",
        bookCode: localStorage["browsing-book-id"],
        chapterTitle: title,
        chapterNumber: newChapterNumber
    }
    if(title != null) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            url: 'http://localhost:8080/book',
            data: JSON.stringify(messageJSON),
            success: function() {
                    localStorage["number-of-chapters"] = newChapterNumber;
                    renderChapter(newChapterNumber, title);
            }})
    }
}

function changeChapterName(chapterNumber) {
    var newName = prompt("New chapter name");
    if(newName != null) {
        var messageJSON = {
            type: "change-chapter-name",
            bookCode: localStorage["browsing-book-id"],
            chapterNumber: chapterNumber,
            newChapterName: newName
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            url: 'http://localhost:8080/book',
            data: JSON.stringify(messageJSON),
            success: function(response) {
                location.reload();
            }
        })
    }
}

function deleteChapter(chapterNumber) {
    var messageJSON = {
        type: "delete-chapter",
        bookCode: localStorage["browsing-book-id"],
        chapterNumber: chapterNumber
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8;',
        url: 'http://localhost:8080/book',
        data: JSON.stringify(messageJSON),
        success: function(response) {
            location.reload();
        }
    })
}

initializeChapterList();