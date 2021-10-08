var saveContentButton = document.getElementById("save-content-btn");
var title = document.getElementById("title");

function initializePage() {
    title.insertAdjacentHTML('afterbegin', "<h2> Chapter " + localStorage["browsing-chapter-num"] + " - " + localStorage["browsing-chapter-title"]);
    title.insertAdjacentHTML('afterbegin', "<h1> Book " + localStorage["browsing-book-name"]);
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
            richTextField.document.getElementsByTagName('body')[0].innerHTML = response;
            }
        })
}

function enableEditMode() {
    richTextField.document.designMode = 'On';
}

function execCmd(command) {
    richTextField.document.execCommand(command, false, null);
}

function execCommandWithArg(command, arg) {
    richTextField.document.execCommand(command, false, arg);
}

saveContentButton.onclick = function() {
    var messageJSON = {
        type: "save-chapter-content",
        bookCode: localStorage["browsing-book-id"],
        chapterNumber: localStorage["browsing-chapter-num"],
        content: richTextField.document.getElementsByTagName('body')[0].innerHTML
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

initializePage();
initializeChapterContent();