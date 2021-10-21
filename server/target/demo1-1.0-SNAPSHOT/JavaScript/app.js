const bookContainer = document.getElementById("booklist");

function getAllBook(){
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: 'http://localhost:8080/list',
        success: function(data) {
            for(var i = 0; i < data.length; i++) {
                showBook(data[i].code, data[i].bookName, data[i].authorName);
            }
        }})
}

function showBook(bCode, bName, aName) {
    var openBook = "openBookTableOfContent(" + bCode + ")";
    let html="";
    html += "<div class='book col-lg-4'>"+
        "       <a href='reader/index.html' onclick='" + openBook + "'>"+
        "       <h1 class='book-title'>"+ bName +"</h1>\n"+
        "       </a>\n"+
        "       <p class='book-author'>"+ aName +"</p>\n"+
        "    </div>";
    bookContainer.innerHTML += html;
}

function openBookTableOfContent(bookCode) {
    window.localStorage.setItem("current-read-book", bookCode);
    window.location.href = "../index.html";
}

getAllBook();

