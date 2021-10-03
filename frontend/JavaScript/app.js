const book = [{
    id: 1,
    cover: "https://m.media-amazon.com/images/I/41gr3r3FSWL.jpg",
    title: "Book 1",
    author: "Author's name"
}, {
    id: 2,
    cover: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/contemporary-fiction-night-time-book-cover-design-template-1be47835c3058eb42211574e0c4ed8bf_screen.jpg?ts=1594616847",
    title: "Book 2",
    author: "Author's name"
}
]
const bookContainer = document.getElementById("booklist");
let html="";
for (let i = 0; i<book.length; i++){
    html += "<div id='"+book[i].id+"'class='book col-lg-3'>\n "+
        "       <a href='/book.html?id="+book[i].id+"'>"+
        "       <img class='book-cover' src='"+book[i].cover+"' alt=''>\n"+
        "       </a>\n"+
        "       <h1 class='book-title'>"+book[i].title+"</h1>\n"+
        "       <p class='book-author'>"+book[i].author+"</p>\n"+
        "    </div>";
}
bookContainer.innerHTML = html;