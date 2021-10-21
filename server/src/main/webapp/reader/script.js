var chapterContainer = document.getElementById("chapter-content");
var bmark = "bookCode" + localStorage["current-read-book"] + "chapterCode" + localStorage["current-read-book-chapter"];
var hl = "bCode" + localStorage["current-read-book"] + "cCode" + localStorage["current-read-book-chapter"];
let footNotesArr = [];

function renderChapterContent() {
    if (localStorage["current-book-read-chapter"] !== null) {
        var chapterUrl = 'http://localhost:8080/getChapter?bcode=' + localStorage["current-read-book"] + "&index=" + localStorage["current-read-book-chapter"];
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
    let chapterContent = renderFootnote(data.content) // the data here is still string
    html += "<h3>" + data.title + "</h3>" + // build html element as string
        "<div class='chapter-content'> " + chapterContent +
        "</div>"
    chapterContainer.innerHTML += html; // add html element to the DOM as chapterContainer inner div
    loadHighlight()
    bookScroll();
}

renderChapterContent();


// script for Footnote - START
function renderFootnote(chapterContent) {
    localStorage.setItem("chapter-content", chapterContent);
    let footnotes = chapterContent.match(/<footnote>.*<\/footnote>/g); // get all the footnote text

    if (footnotes !== null) {
        let html = "";
        storeFootnoteData(footnotes)
        let non_footnote_text = chapterContent.split(/<footnote>.*<\/footnote>/g) // return non-footNote text

        for (let i=0;i < footnotes.length; i++) {
            let footnote_index = i + 1;
            html += non_footnote_text[i];
            html += "<a onclick='openFootNote(" +i +")' id='" + i + "' href='javascript:void(0)'>[" + footnote_index + "]</a>";
        }
        html += non_footnote_text[footnotes.length];
        return html;
    }
    return chapterContent;
}

function storeFootnoteData(footnotes) {
    for (let i = 0; i < footnotes.length; i++) {
        let footnoteContent = footnotes[i].replace(/<\/?footnote>/g, '');
        let footnote = {
            "index" : i + 1,
            "content" : footnoteContent
        }
        footNotesArr.push(footnote)
    }
}

function openFootNote(footnoteIndex) {
    let footnote = footNotesArr[footnoteIndex];
    window.alert(footnote.content)
}
// SCRIPT FOR FOOTNOTE - END

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
function getLastTextNode(node){
    if(!node) return null
    if (node.nodeType === Node.TEXT_NODE) return node
    let child = node.childNodes;
    for(let i = child.length - 1; i>=0; i--){
        if (child[i].nodeType === Node.TEXT_NODE){
            return child[i]
        }else{
            let textNode = getLastTextNode(child[i])
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
function getHighlightPos() {
    let hArr = []
    let content = $('.chapter-content')[0]
    let node = getFirstTextNode(content)
    let index = 0;
    let length = 0;

    let hasNextNode = true;
    while(hasNextNode) {
        if (node.parentNode.className !== "highlight") {
            index += node.length
        } else {
            length += node.length
            hArr.push({
                start: index,
                length: length
            })
            index += node.length
            length = 0
        }
        hasNextNode = false
        while(!hasNextNode && node!== getLastTextNode(content)){
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
    return hArr
}

function increaseFontSize(){
    var content = document.getElementsByClassName("chapter-content");
    var contentFSize = parseInt(getComputedStyle(content[0]).fontSize);
    if(contentFSize < maxSize){
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

function loadHighlight() {
    let CC = $('.chapter-content')[0];
    let node = getFirstTextNode(CC)
    let arr = JSON.parse(localStorage.getItem(hl))
    if (arr.length !== 0) {
        let index = 0; // highlightCounter
        let length = 0; // total length of textNode
        let hasNextNode = true;
        while(hasNextNode) {
            if ((length + node.length) > arr[index].start) {

                let startIndex = arr[index].start - length; // get position of starting span in the text node
                let spanNode = node.splitText(startIndex) // split current text node at the start offset
                spanNode.splitText(arr[index].length) // split again with the length of highlight

                var newNode = document.createElement("span"); // new node to append later
                newNode.textContent = spanNode.textContent;
                newNode.className = "highlight";
                node.parentNode.replaceChild(newNode, spanNode);
                length += node.length; // update the current length of plain text
                if (index < arr.length - 1) {
                    index++;
                } else {
                    break
                }
            } else {
                length += node.length;
            }
            hasNextNode = false
            while(!hasNextNode && node!== getLastTextNode(CC)){
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
    }
}


function bookScroll(){
    var bookmark = localStorage.getItem(bmark);
    if (bookmark) {
        window.scrollTo(0, localStorage.getItem(bmark));
    }
}

window.onbeforeunload = function(e) {
    localStorage.setItem(bmark, window.scrollY)
    localStorage.setItem(hl, JSON.stringify(getHighlightPos()))
};
