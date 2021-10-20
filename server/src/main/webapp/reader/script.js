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

function getSafeRange(range){
    let rArr = []
    let node = range.startContainer
    let hasNextNode = true;
    while(hasNextNode) {
        let startPoint = node === range.startContainer ? range.startOffset : 0
        let endPoint = node === range.endContainer ? range.endOffset : node.textContent.length
        let r = document.createRange()
        r.setStart(node, startPoint)
        r.setEnd(node, endPoint)
        rArr.push(r)
        hasNextNode = false
        while(!hasNextNode && node!== range.endContainer){
            let nextNode = getFirstTextNode(node.nextSibling)
            if(nextNode){
                node = nextNode
                hasNextNode = true
            }else{
                if(node.nextSibling){
                    node = node.nextSibling
                }else if(node.parentNode){
                    node = node.parentNode
                }else break
            }
        }
    }
    return rArr
}

function getFirstTextNode(node){
    if(!node) return null
    if (node.nodeType === Node.TEXT_NODE) return node
    var child = node.childNodes
    for(let i = 0; i<child.length; i++){
        if (child[i].nodeType === Node.TEXT_NODE){
            return child[i]
        }else{
            let textNode = getFirstTextNode(child[i])
            if(textNode !== null) return textNode
        }
    }

    return null
}

function highlightSelection(){
    var selection = window.getSelection();
    var dangerousRange = selection.getRangeAt(0);
    var rArr = getSafeRange(dangerousRange);
    for(let i = 0; i<rArr.length; i++) {
        if (rArr[i].startContainer.textContent === "") {
            continue;
        }
        if (rArr[i].startContainer.parentNode.className !== "highlight") {
            highlightText(rArr[i])
        } else {
            unhighlightText(rArr[i])
        }
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

function unhighlightText(range){
    let hNode = range.startContainer.parentNode
    let tNode = document.createTextNode(range.toString())
    let newNode_1 = document.createElement("span")
    newNode_1.className = "highlight"
    newNode_1.textContent = hNode.innerHTML.substr(0, range.startOffset)
    let newNode_2 = document.createElement("span")
    newNode_2.className = "highlight"
    newNode_2.textContent = hNode.innerHTML.substr(range.endOffset)
    hNode.remove()
    range.insertNode(newNode_2)
    range.insertNode(tNode)
    range.insertNode(newNode_1)
}

function increaseFontSize(){
    var content = document.getElementsByClassName("chapter-content");
    var contentFSize = parseInt(getComputedStyle(content[0]).fontSize);
    if(contentFsize < maxSize){
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
    if(contentFSize > minSize){
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
        return match.trim()
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

}

window.onbeforeunload = function(e) {
    localStorage.setItem(bmark, window.scrollY);
    localStorage.setItem(hl, JSON.stringify(getHighlightPos()))
};
