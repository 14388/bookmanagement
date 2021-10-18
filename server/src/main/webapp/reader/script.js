var chapterContainer = document.getElementById("chapter-content");
var bmark = "bookCode" + localStorage["current-read-book"] + "chapterCode" + localStorage["current-read-book-chapter"];
var hl = "bCode" + localStorage["current-read-book"] + "cCode" + localStorage["current-read-book-chapter"];

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
    let chapterContent = loadHighlight(data.content)
    html += "<h3>" + data.title + "</h3>" +
        "<div class='chapter-content'> " + chapterContent +
        "</div>"
    chapterContainer.innerHTML += html;
    bookScroll();
}

renderChapterContent();

let highlighted = false;
let maxSize = 100; //px
let minSize = 0; //px

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
    var content = document.getElementsByClassName("chapter-content");
    var contentFSize = parseInt(getComputedStyle(content[0]).fontSize);
    if(currentFontsize < maxSize){
            content[0].style.fontSize = contentFSize + 2 + "px";
    }
    var fSize_list = document.getElementsByClassName("font-size");
    for(var i=0; i<fSize_list.length; i++){
        var currentFontsize = parseInt(getComputedStyle(fSize_list[i]).fontSize);
        if(currentFontsize < maxSize){
            fSize_list[i].style.fontSize = currentFontsize + 2 + "px";
        }
    }
}
function decreaseFontSize(){
    var content = document.getElementsByClassName("chapter-content");
    var contentFSize = parseInt(getComputedStyle(content[0]).fontSize);
    if(currentFontsize > minSize){
            content[0].style.fontSize = contentFSize - 2 + "px";
    }
    var fSize_list = document.getElementsByClassName("font-size");
    for(var i=0; i<fSize_list.length; i++){
        var currentFontsize = parseInt(getComputedStyle(fSize_list[i]).fontSize);
        if(currentFontsize > minSize){
            fSize_list[i].style.fontSize = currentFontsize - 2 + "px";
        }
    }
}
function getHighlightPos() {
    var str = document.getElementsByClassName("chapter-content")[0].innerHTML.trim()
    let arr = str.match(/<span class="highlight">[\w .,]+<\/span>/g) // find all content inside highlight
    if(arr !== null){
        let arrWord = arr.map(s => s.replace(/<\/?span( class="highlight")?>/g, ''))//highlight text
        let arr2 = str.split(/<span class="highlight">[\w .,]+<\/span>/) // return non-highlight text
        arr2 = arr2.map(s => s.replace(/<\/?(.*?)>/g, '')) //delete all tag
        let idxArr = []
        let currentLen = 0
        for (let i = 0; i < arr.length; i++) {
            currentLen += arr2[i].length
            let idx = {
                start: currentLen,
                end: currentLen + arrWord[i].length
            }
            currentLen += arrWord[i].length
            idxArr.push(idx)
        }
        return idxArr
    }
    return null
}

function loadHighlight(html) {
    html = html.replace(/(?<=<[^\/]*?>)(.*?)(?=<.*?>)/g, function(match){ //remove redundant whitespace inside tag
        let trMatch = match.trim()
        return trMatch;
    })
    console.log(html)
    let arr = JSON.parse(localStorage.getItem(hl))
    if(arr !== null) {
        for (var i = 0; i < arr.length; i++) {
            var start = arr[i].start
            var end = arr[i].end
            var reg = /<.*?>/g
            while ((tag = reg.exec(html)) !== null) {
                if (tag.index < start) {
                    start += tag.toString().length
                    end += tag.toString().length
                }
            }
            if(html[0] === "\r" | html[0] === "\n"){
                html = html.substr(0, start+1) + "<span class='highlight'>" + html.substr(start+1, end - start) + "</span>" + html.substr(end + 1)
            }else{
                html = html.substr(0, start) + "<span class='highlight'>" + html.substr(start, end - start) + "</span>" + html.substr(end)
            }
        }
    }
    return html
}
function bookScroll(){
    var bookmark = localStorage.getItem(bmark);
    if (bookmark) {
        window.scrollTo(0, localStorage.getItem(bmark));
    }

};

window.onbeforeunload = function(e) {
    localStorage.setItem(bmark, window.scrollY);
    localStorage.setItem(hl, JSON.stringify(getHighlightPos()))
};
