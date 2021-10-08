if(localStorage.getItem("author") == null) {
    var author = null;
    while(author == null) {
        author = prompt("Welcome to our book application, what's your name ?", "");
    }
    localStorage.setItem("author", author);
    location.reload();
} else {
    var welcomeTitle = document.getElementById("welcome-title");
    welcomeTitle.insertAdjacentHTML('afterbegin', "<h1> Hello " + localStorage["author"] + "</h1>");
    welcomeTitle.insertAdjacentHTML('afterend',"<button type=\"button\" id=\"create-book-btn\"><i class = \"far fa-plus-square\"></i> Create new book</button>");
}


var createBookButton = document.getElementById("create-book-btn");

initializeBookList();

createBookButton.onclick = function() {
    var title = prompt("Title of your new book");
    var messageJSON = {
        type: "create",
        bookName: title,
        authorName: localStorage["author"]
    }
    console.log(JSON.stringify(messageJSON));

    var bookList;
    if(localStorage["book-list"] == null) {
        bookList = new Array;
    } else {
        bookList = JSON.parse(localStorage["book-list"]);
    }
    if(title != null) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            url: 'http://localhost:8080/book',
            data: JSON.stringify(messageJSON),
            success: function(response) {
                var newBookID = response.newBookID;
                bookList.push(newBookID);
                localStorage.setItem("book-list", JSON.stringify(bookList));
                renderBook(newBookID, title);
            }})
    }
}

function initializeBookList() {
    if(localStorage["book-list"] != null) {
        var bookList = JSON.parse(localStorage["book-list"]);
        var messageJSON = {
            type: "get-author-books",
            bookCodeList: bookList
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            url: 'http://localhost:8080/book',
            data: JSON.stringify(messageJSON),
            success: function(response) {
                for(var i = 0; i < response.length; i++) {
                    renderBook(response[i].code, response[i].bookName);
                }
            }
        })

    }
}

function renderBook(bookCode, bookName) {
    var onclickFunction = "editBook(" + bookCode + ",\"" + bookName + "\")";
    createBookButton.insertAdjacentHTML('beforebegin', "<div>" + bookName +
        "<button style=\"left: 1%;position: relative;\" title=\"Change name\"> <i class=\"fas fa-feather\"></i></button>" +
        "<button style=\"left: 1.2%; position: relative;\" title=\"Edit\" onclick='" + onclickFunction  + "'> <i class=\"fas fa-edit\"></i></button>" +
        "<button style=\"left: 1.4%;position: relative;\" title=\"Delete\"> <i class=\"fas fa-trash\"></i></button></div><br/>");
}

function editBook(bookCode,bookName) {
    localStorage.setItem("browsing-book-name", bookName);
    localStorage.setItem("browsing-book-id", bookCode);
    window.location.href = 'chapter.jsp';
}
