var chapterContainer = document.getElementById("chapter-content");
var bmark = "bookCode" + localStorage["current-read-book"] + "chapterCode" + localStorage["current-read-book-chapter"];

function renderChapterContent() {
    if (localStorage["current-book-read-chapter"] !== null) {
        var chapterUrl = 'http://localhost:8080/getChapter?bcode=' + localStorage["current-read-book"] + "&index=" + localStorage["current-read-book-chapter"];
        console.log(chapterUrl)
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: chapterUrl,
            success: function(data) {
                renderChapter(data);
            }})
    }
}

function renderChapter(data) {
    let html = "";
    html += "<h3>" + data.title + "</h3>" +
        "<div class='chapter-content'> " + data.content +
        "</div>"
    chapterContainer.innerHTML += html;
    bookScroll();
}

renderChapterContent();

let highlighted = false;
let maxSize = 30; //px
let minSize = 10; //px

function highlightSelection(){
    var highlighted = false;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var selectedText = selection.toString();
    var startPoint = range.startOffset;
    var endPoint = range.endOffset;
    var startTag = range.startContainer.parentNode;
    var endTag = range.endContainer.parentNode;
    if(selectedText.length === (endPoint - startPoint)){
        highlighted = true;
        if (startTag.className !== "highlight") {
            highlightText(range);
        } else {
            var afterText = selectedText + "<span class='highlight'>" + startTag.innerHTML.substr(endPoint) + "</span>";
            startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
            startTag.insertAdjacentHTML('afterend', afterText);
        }
    }else{
        if(startTag.className !== "highlight" && endTag.className !== "highlight"){
            highlightText(range);
            highlighted = true;
        }
    }
    if (startTag.className === "highlight" && endTag.className === 'highlight' && !highlighted) {
        highlightText(range);
        highlighted = true;
    }
    if (startTag.className === "highlight" && !highlighted){
        highlighted = true;
        var startTag_remains = startTag.innerHTML.substr(0, startPoint);
        var startTag_selected = startTag.innerHTML.substr(startPoint);
        var outer_text = selectedText.substr(startTag_selected.length, selectedText.length);
        range.deleteContents();
        startTag.innerHTML = startTag_remains;
        startTag.insertAdjacentHTML('afterend', startTag_selected + outer_text);
    }
    if (endTag.className === "highlight" && !highlighted){
        highlighted = true;
        var endTag_remains = endTag.innerHTML.substr(endPoint, endTag.length);
        var endTag_selected = endTag.innerHTML.substr(0, endPoint);
        var outer_text = selectedText.substr(0, selectedText.length - endTag_selected.length);
        range.deleteContents();
        endTag.innerHTML = endTag_remains;
        endTag.insertAdjacentHTML('beforeBegin', outer_text + endTag_selected);
    }
    $('.highlight').each(function(){
        if($(this).html() === ''){
            $(this).remove();
        }
    });

}

function highlightText(range){
    var newNode = document.createElement("span");
    newNode.textContent = range.toString();
    range.deleteContents();
    newNode.className = "highlight";
    range.insertNode(newNode);
}

function increaseFontSize(){
    var content_list = document.getElementsByClassName("chapter-content");
    for(var i=0; i<content_list.length; i++){
        var currentFontsize = parseInt(getComputedStyle(content_list[i]).fontSize);
        if(currentFontsize < maxSize){
            content_list[i].style.fontSize = currentFontsize + 2 + "px";
        }
    }
}
function decreaseFontSize(){
    var content_list = document.getElementsByClassName("chapter-content");
    for(var i=0; i<content_list.length; i++){
        var currentFontsize = parseInt(getComputedStyle(content_list[i]).fontSize);
        if(currentFontsize > minSize){
            content_list[i].style.fontSize = currentFontsize - 2 + "px";
        }
    }
}

function bookScroll(){
    var bookmark = localStorage.getItem(bmark);
    if (bookmark) {
        window.scrollTo(0, localStorage.getItem(bmark));
    }

};
window.onbeforeunload = function(e) {
    localStorage.setItem(bmark, window.scrollY);
};
