const bookContainer = document.getElementById("booklist");

function getAllBook(){
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: 'http://localhost:8080/book/all',
        success: function(data) {
            showAllBook(data);
        }})
}

function showAllBook(bookList) {
    let html="";
    for (let i = 0; i < bookList.length ; i++){
        html += "<div id='"+ bookList[i].code + "'class='book col-lg-3'>\n "+
            "       <a href='/book?bcode=" + bookList[i].code + "'>"+
            "       <h1 class='book-title'>"+ bookList[i].bookName +"</h1>\n"+
            "       </a>\n"+
            "       <p class='book-author'>"+ bookList[i].authorName +"</p>\n"+
            "    </div>";
    }
    bookContainer.innerHTML = html;
}

getAllBook();

