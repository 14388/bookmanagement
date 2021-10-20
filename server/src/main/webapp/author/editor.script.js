var saveContentButton = document.getElementById("save-content-btn");
var renderContentButton = document.getElementById("render-btn");
var editor = document.getElementById("editor");
var title = document.getElementById("title");

function initializePage() {
    title.insertAdjacentHTML('afterbegin', "<h2 style='color: rgba(84,84,84,1.00);text-decoration-line: underline'> Chapter " + localStorage["browsing-chapter-num"] + " - " + localStorage["browsing-chapter-title"]);
    title.insertAdjacentHTML('afterbegin', "<h1 style='color: rgba(84,84,84,1.00);text-decoration-line: underline'> Book " + localStorage["browsing-book-name"]);
}

function initializeChapterContent() {
    var messageJSON = {
        type: "get-chapter-content",
        bookCode: localStorage["browsing-book-id"],
        chapterNumber: localStorage["browsing-chapter-num"]
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8;',
        url: 'http://localhost:8080/book',
        data: JSON.stringify(messageJSON),
        success: function(response) {
            editor.value = response;
            if(response === '') {
                initializeEditor();
            } else {
                // Remove <div> tag
                let doc = document.createElement('body');
                doc.innerHTML = response;
                let  div = doc.getElementsByTagName('div');
                editor.value = div[0].innerHTML;
            }
        }
    })
}

saveContentButton.onclick = function() {
    let text = editor.value;
    var messageJSON = {
        type: "save-chapter-content",
        bookCode: localStorage["browsing-book-id"],
        chapterNumber: localStorage["browsing-chapter-num"],
        content: text
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8;',
        url: 'http://localhost:8080/book',
        data: JSON.stringify(messageJSON),
        success: function(response) {
            alert(response);
        }
    })
}

editor.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        editor.focus();
        editor.value += '\r\n\r\n' + "<p>" + '\r\n' + "</p>";
        editor.selectionStart -= 5;
        editor.selectionEnd -= 5;
    }
});


editor.onpaste = function(event) {
    event.preventDefault();
    let text = event.clipboardData.getData('text');
    var numberOfLineBreaks = (text.match(/\r?\n/g)||[]).length;
    var paragraphs = text.split(/\r?\n/g);
    if(numberOfLineBreaks > 0) {
        for(var i = 0; i < paragraphs.length; i++) {
            if(paragraphs[i] !== '') {
                editor.value += "\r\n\r\n" + "<p>" + "\r\n" + paragraphs[i] + "\r\n" +"</p>";
            }
        }
    }else {
        var len = editor.value.length;
        var start = editor.selectionStart;
        var end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + paragraphs[0] + editor.value.substring(end, len);
    }
}

function initializeEditor() {
    editor.focus();
    editor.value += "<p>" + '\r\n\r\n' + "</p>";
    editor.selectionStart -= 5;
    editor.selectionEnd -= 5;
}

renderContentButton.onclick = function() {
    render.document.getElementsByTagName('body')[0].innerHTML = editor.value;
    var footnotes = render.document.getElementsByTagName('footnote');
    var footnodeCount = 1;
    while(typeof(footnotes[0]) !== 'undefined') {
        var footnoteNode = document.createElement('a');
        var footnodeContent= footnotes[0].innerHTML;
        footnoteNode.innerHTML = "[" + footnodeCount + "]";
        footnoteNode.onclick = (function(footnodeContent) {
            return function(){ displayFootnote(footnodeContent); }
        })(footnodeContent);
        footnoteNode.setAttribute('content', footnodeContent);
        footnoteNode.setAttribute('href', 'javascript:void(0)');
        footnotes[0].parentNode.replaceChild(footnoteNode, footnotes[0]);
        footnodeCount += 1;
    }
}

function displayFootnote(content) {
    alert(content);
}

function formatText(style) {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);
    var replace = "";
    if(selection !== '') {
        if(style === 'bold') {
            replace = "<b>" + selection + "</b>";
        }
        else if(style === 'italic') {
            replace = "<i>" + selection + "</i>";
        }
        else if(style === 'underline') {
            replace = "<u>" + selection + "</u>";
        }
        editor.value =  editor.value.substring(0,start) + replace + editor.value.substring(end,len);
    }
}

function changeFontStyle(font) {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);
    var replace = "<span style=\"font-family: " + font.value + ";\">" + selection + "</span>";
    if(selection !== '') {
        editor.value =  editor.value.substring(0,start) + replace + editor.value.substring(end,len);
    }

}

function changeFontSize(size) {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);
    var replace = "<span style=\"font-size: " + size.value + ";\">" + selection + "</span>";
    editor.value =  editor.value.substring(0,start) + replace + editor.value.substring(end,len);
}

function changeFontColour(colour) {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);
    var replace = "<span style=\"color: " + colour.value + ";\">" + selection + "</span>";
    editor.value =  editor.value.substring(0,start) + replace + editor.value.substring(end,len);
}

function newParagraph() {
    editor.focus();
    editor.value += '\r\n\r\n' + "<p>" + '\r\n\r\n' + "</p>";
    editor.selectionStart -= 5;
    editor.selectionEnd -= 5;
}

function textAlign(textAlignment) {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);

    // Insert opening tag for text alignment after <p>
    while(!selection.includes('<p>') &&
    !selection.includes('<div style="text-align: right">') &&
    !selection.includes('<div style="text-align: left">') &&
    !selection.includes('<div style="text-align: center">')) {
        start -= 1;
        selection = editor.value.substring(start,end);
    }
    while(selection !== '<p>' &&
    selection !== '<div style="text-align: right">' &&
    selection !== '<div style="text-align: left">' &&
    selection !== '<div style="text-align: center">') {
        end -= 1;
        selection = editor.value.substring(start,end);
    }
    editor.value = editor.value.substring(0, end) + "\n" + "<div style=\"text-align: " + textAlignment + "\">" + editor.value.substring(end, len);
    len = editor.value.length;


    selection = editor.value.substring(start,end);
    // Insert closing tag for text alignment before </p>
    while(!selection.includes('</p>')){
        end += 1;
        selection = editor.value.substring(start,end);
    }
    while(selection !=='</p>') {
        start += 1;
        selection = editor.value.substring(start,end);
    }
    editor.value = editor.value.substring(0, start) + "</div>" + "\n" + editor.value.substring(start, end) + editor.value.substring(end, len);
    len = editor.value.length;
}

function addFootnote() {
    editor.focus();
    var len = editor.value.length;
    var start = editor.selectionStart;
    var tempStart = start;
    var end = editor.selectionEnd;
    var selection = editor.value.substring(start, end);
    var wrappedByAnotherFootnote = false;
    if(selection === '') {
        var newFootnote = prompt("Add new footnote: ");
        if(newFootnote !== '' && newFootnote !== null) {
            while(!selection.includes('<p>')) {
                tempStart -= 1;
                selection = editor.value.substring(tempStart, end);
                if(selection.includes('</footnote>')) {
                    break;
                }
                else if(selection.includes('<footnote>')) {
                    wrappedByAnotherFootnote = true;
                    break;
                }
            }
            if(!wrappedByAnotherFootnote) {
                var replace = " <footnote>" + newFootnote + "</footnote> ";
                editor.value =  editor.value.substring(0,start) + replace + editor.value.substring(end,len);
            }
        }
    }
}

initializePage();
initializeChapterContent();