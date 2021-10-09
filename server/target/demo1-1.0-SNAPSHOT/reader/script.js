/* Button */
let isBold = false;
let isItalic = false;
let highlighted = false;
let maxSize = 30; //px
let minSize = 10; //px


// function toItalic() {
//     let style = 'italic';
//     changeFontStyle(style)
// }
//
// function changeToNormal() {
//     let style = 'normal';
//     changeFontStyle(style)
// }

function toBold() {
    if (isBold === false) {
        changeFontWeight('bold');
        isBold = true;
    } else {
        changeFontWeight('normal')
        isBold = false;
    }
}

function changeFontWeight(weight) {
    var chapter = document.getElementsByClassName("chapter-content");
    for (let i = 0; i < chapter.length; i++) {
        chapter[i].style.fontWeight = weight;
    }
}

function toItalic(style) {
    if (isItalic === false) {
        changeFontStyle('italic');
        isItalic = true;
    } else {
        changeFontStyle('normal')
        isItalic = false;
    }
}

function changeFontStyle(style) {
    var chapter = document.getElementsByClassName("chapter-content");
    for (let i = 0; i < chapter.length; i++) {
        chapter[i].style.fontStyle = style;
    }
}

function highlightSelection(){
    var highlighted = false;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var selectedText = selection.toString();
    var startPoint = range.startOffset;
    var endPoint = range.endOffset;
    var anchorTag = range.startContainer.parentNode;
    var focusTag = range.endContainer.parentNode;
    if(selectedText.length === (endPoint - startPoint)){
        highlighted = true;
        console.log(document.getElementById("content1").innerHTML);
        if (anchorTag.className !== "highlight") {
            highlightText(range);
        } else {
            var afterText = selectedText + "<span class='highlight'>" + anchorTag.innerHTML.substr(endPoint) + "</span>";
            anchorTag.innerHTML = anchorTag.innerHTML.substr(0, startPoint);
            anchorTag.insertAdjacentHTML('afterend', afterText);
        }
    }else{
        if(anchorTag.className !== "highlight" && focusTag.className !== "highlight"){
            highlightText(range);
            highlighted = true;
        }
    }
    if (anchorTag.className === "highlight" && focusTag.className === 'highlight' && !highlighted) {
        highlightText(range);
        highlighted = true;
    }
    if (anchorTag.className === "highlight" && !highlighted){
        highlighted = true;
        var anchorTag_remains = anchorTag.innerHTML.substr(0, startPoint);
        var anchorTag_selected = anchorTag.innerHTML.substr(startPoint);
        var outer_text = selectedText.substr(anchorTag_selected.length, selectedText.length);
        range.deleteContents();
        anchorTag.innerHTML = anchorTag_remains;
        anchorTag.insertAdjacentHTML('afterend', anchorTag_selected + outer_text);
    }
    if (focusTag.className === "highlight" && !highlighted){
        highlighted = true;
        var focusTag_remains = focusTag.innerHTML.substr(endPoint, focusTag.length);
        var focusTag_selected = focusTag.innerHTML.substr(0, endPoint);
        var outer_text = selectedText.substr(0, selectedText.length - focusTag_selected.length);
        range.deleteContents();
        focusTag.innerHTML = focusTag_remains;
        focusTag.insertAdjacentHTML('beforeBegin', outer_text + focusTag_selected);
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
        console.log(currentFontsize);
        if(currentFontsize < maxSize){
            content_list[i].style.fontSize = currentFontsize + 2 + "px";
        }
    }
}
function decreaseFontSize(){
    var content_list = document.getElementsByClassName("chapter-content");
    for(var i=0; i<content_list.length; i++){
        var currentFontsize = parseInt(getComputedStyle(content_list[i]).fontSize);
        console.log(currentFontsize);
        if(currentFontsize > minSize){
            content_list[i].style.fontSize = currentFontsize - 2 + "px";
        }
    }
}