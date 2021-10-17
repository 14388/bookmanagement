var saveContentButton = document.getElementById("save-content-btn");
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
            richTextField.document.getElementsByTagName('body')[0].innerHTML = response;
            }
        })
}

function enableEditMode() {
    richTextField.document.designMode = 'On';
}

richTextField.document.getElementsByTagName('body')[0].addEventListener('paste', (event) => {
    event.preventDefault();

    let text = event.clipboardData.getData('text');

    richTextField.document.execCommand("insertText", false, text);

});

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

function italic() {
    var formatted = false;
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        var endTag = range.endContainer.parentNode;
        var outerNode = null;
        var selectedText = "";
        var nodeCounter = 0;
        var condition = 0;

        while(typeof(range.cloneContents().childNodes[nodeCounter]) !== 'undefined') {
            if(typeof(range.cloneContents().childNodes[nodeCounter].outerHTML) !== 'undefined') {
                selectedText += range.cloneContents().childNodes[nodeCounter].outerHTML;
            }
            else if(typeof(range.cloneContents().childNodes[nodeCounter].textContent) !== 'undefined'){
                selectedText += range.cloneContents().childNodes[nodeCounter].textContent;
            }
            nodeCounter = nodeCounter + 1;
        }

        while(startTag.tagName !== "HTML" && endTag.tagName !== "HTML") {

            if(startTag.tagName === "I" || endTag.tagName === "I"){
                condition = condition + 1;
                if(startTag.firstChild === endTag.firstChild) {
                    formatted = true;
                    break;
                }
                if(condition === 2) {
                    formatted = true;
                    break;
                }
            }
            startTag = startTag.parentNode;
            endTag = endTag.parentNode;
        }

        if(!formatted) {
            if(childNodesList != null) {
                var counter = 0;
                var totalItalicElementNode = getNumberOfElementNode(childNodesList, "I");
                for(var j = 0; j < childNodesList.length; j++) {
                    if(childNodesList[j].tagName === "I") {
                        counter = counter + 1;
                        var parentNode = childNodesList[j].parentNode;
                        while(childNodesList[j].firstChild) {
                            outerNode = childNodesList[j].firstChild;
                            if(childNodesList[childNodesList.length - 1].tagName === "I") {
                                break;
                            }
                            if(!selectedText.includes("<i>")) {
                                break;
                            }
                            if( startTag.tagName === "HTML" ||startTag.tagName === "BODY" || startTag.tagName === "U" || startTag.tagName === "B" || startTag.tagName === "SPAN" || startTag.tagName === "DIV") {
                                while(parentNode.tagName !== "BODY") {
                                    if(childNodesList[j].nextSibling === null || childNodesList[j].nextSibling.nodeType === 3) {
                                        break;
                                    }
                                    else {
                                        if(parentNode.tagName === "U") {
                                            const newNode = document.createElement('u');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;
                                        }
                                        else if(parentNode.tagName === "B") {
                                            const newNode = document.createElement('b');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;

                                        }
                                        while(parentNode.firstChild) {
                                            parentNode.parentNode.insertBefore(parentNode.firstChild, parentNode)
                                        }
                                        parentNode.parentNode.removeChild(parentNode);
                                        parentNode = childNodesList[j].parentNode;
                                    }
                                }
                                if((startTag.tagName === "HTML" && endTag.tagName === "BODY") && counter === totalItalicElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                else if((startTag.tagName === "BODY" && endTag.tagName === "HTML") && counter === totalItalicElementNode){
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j].nextSibling);
                                    continue;
                                }
                                else if((startTag.tagName === "HTML" && endTag.tagName === "HTML") && counter === totalItalicElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                parentNode.insertBefore(outerNode, childNodesList[j].nextSibling);
                            }
                            else {
                                parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                            }

                        }
                        if(childNodesList[childNodesList.length - 1].tagName !== "I" && selectedText.includes("<i>")) {
                            parentNode.removeChild(childNodesList[j]);
                        }


                    }
                }

            }
            const newNode = document.createElement('i');
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
        }
        else {
            var selectedTextString = selection.toString();
            var tempString = selectedTextString;
            var openingTag = "";
            var closingTag = "";
            var startTag = range.startContainer.parentNode;
            var endTag = range.endContainer.parentNode;
            var startPoint = range.startOffset;
            var endPoint = range.endOffset;
            while(startTag.tagName !== "BODY" && endTag.tagName !== "BODY") {
                if(startTag.tagname === "I" || endTag.tagName === "I"){
                    openingTag += "<i>";
                    closingTag += "</i>";
                    break;
                } else {
                    if(startTag.tagName === "B") {
                        openingTag += "<b>";
                        closingTag += "</b>";
                    } else if(startTag.tagName === "U") {
                        openingTag += "<u>";
                        closingTag += "</u>"
                    }
                }
                startTag = startTag.parentNode;
                endTag = endTag.parentNode;
            }
            var startTagTextContent = startTag.textContent;
            startTag = range.startContainer.parentNode;
            if(startTagTextContent.indexOf(selectedTextString) === 0){
                var finalString = selectedTextString + openingTag + startTag.innerHTML.substr(endPoint);
                startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                startTag.insertAdjacentHTML('afterend', finalString);
                startTag.outerHTML = '';
            }
            else {
                var selectedTextStringReversed = reverse(selectedTextString);
                if(reverse(startTagTextContent).indexOf(selectedTextStringReversed) === 0) {
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    var finalString = startTag.outerHTML + tempString;
                    startTag.insertAdjacentHTML('afterend', finalString)
                    startTag.outerHTML = '';
                }
                else {
                    var finalString =  tempString + openingTag + startTag.innerHTML.substr(endPoint);
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    finalString = endTag.outerHTML + finalString
                    startTag.insertAdjacentHTML('afterend', finalString);
                    startTag.outerHTML = '';
                }
            }

        }
    }
}

function bold() {
    var formatted = false;
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        var endTag = range.endContainer.parentNode;
        var outerNode = null;
        var selectedText = "";
        var nodeCounter = 0;
        var condition = 0;

        while(typeof(range.cloneContents().childNodes[nodeCounter]) !== 'undefined') {
            if(typeof(range.cloneContents().childNodes[nodeCounter].outerHTML) !== 'undefined') {
                selectedText += range.cloneContents().childNodes[nodeCounter].outerHTML;
            }
            else if(typeof(range.cloneContents().childNodes[nodeCounter].textContent) !== 'undefined'){
                selectedText += range.cloneContents().childNodes[nodeCounter].textContent;
            }
            nodeCounter = nodeCounter + 1;
        }

        while(startTag.tagName !== "HTML" && endTag.tagName !== "HTML") {

            if(startTag.tagName === "B" || endTag.tagName === "B"){
                condition = condition + 1;
                if(startTag.firstChild === endTag.firstChild) {
                    formatted = true;
                    break;
                }
                if(condition === 2) {
                    formatted = true;
                    break;
                }
            }
            startTag = startTag.parentNode;
            endTag = endTag.parentNode;
        }

        if(!formatted) {
            if(childNodesList != null) {
                var counter = 0;
                var totalBoldElementNode = getNumberOfElementNode(childNodesList, "B");
                for(var j = 0; j < childNodesList.length; j++) {
                    if(childNodesList[j].tagName === "B") {
                        counter = counter + 1;
                        var parentNode = childNodesList[j].parentNode;
                        while(childNodesList[j].firstChild) {
                            outerNode = childNodesList[j].firstChild;
                            if(childNodesList[childNodesList.length - 1].tagName === "B") {
                                break;
                            }
                            if(!selectedText.includes("<b>")) {
                                break;
                            }
                            if( startTag.tagName === "HTML" ||startTag.tagName === "BODY" || startTag.tagName === "U" || startTag.tagName === "I" || startTag.tagName === "SPAN" || startTag.tagName === "DIV") {
                                while(parentNode.tagName !== "BODY") {
                                    if(childNodesList[j].nextSibling === null || childNodesList[j].nextSibling.nodeType === 3) {
                                        break;
                                    }
                                    else {
                                        if(parentNode.tagName === "U") {
                                            const newNode = document.createElement('u');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;
                                        }
                                        else if(parentNode.tagName === "I") {
                                            const newNode = document.createElement('i');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;

                                        }
                                        while(parentNode.firstChild) {
                                            parentNode.parentNode.insertBefore(parentNode.firstChild, parentNode)
                                        }
                                        parentNode.parentNode.removeChild(parentNode);
                                        parentNode = childNodesList[j].parentNode;
                                    }
                                }
                                if((startTag.tagName === "HTML" && endTag.tagName === "BODY") && counter === totalBoldElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                else if((startTag.tagName === "BODY" && endTag.tagName === "HTML") && counter === totalBoldElementNode){
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j].nextSibling);
                                    continue;
                                }
                                else if((startTag.tagName === "HTML" && endTag.tagName === "HTML") && counter === totalBoldElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                parentNode.insertBefore(outerNode, childNodesList[j].nextSibling);
                            }
                            else {
                                parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                            }

                        }
                        if(childNodesList[childNodesList.length - 1].tagName !== "B" && selectedText.includes("<b>")) {
                            parentNode.removeChild(childNodesList[j]);
                        }


                    }
                }

            }
            const newNode = document.createElement('b');
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
        }
        else {
            var selectedTextString = selection.toString();
            var tempString = selectedTextString;
            var openingTag = "";
            var closingTag = "";
            var startTag = range.startContainer.parentNode;
            var endTag = range.endContainer.parentNode;
            var startPoint = range.startOffset;
            var endPoint = range.endOffset;
            while(startTag.tagName !== "BODY" && endTag.tagName !== "BODY") {
                if(startTag.tagname === "B" || endTag.tagName === "B"){
                    openingTag += "<b>";
                    closingTag += "</b>";
                    break;
                } else {
                    if(startTag.tagName === "U") {
                        openingTag += "<u>";
                        closingTag += "</u>";
                    } else if(startTag.tagName === "I") {
                        openingTag += "<i>";
                        closingTag += "</i>"
                    }
                }
                startTag = startTag.parentNode;
                endTag = endTag.parentNode;
            }
            var startTagTextContent = startTag.textContent;
            startTag = range.startContainer.parentNode;
            if(startTagTextContent.indexOf(selectedTextString) === 0){
                var finalString = selectedTextString + openingTag + startTag.innerHTML.substr(endPoint);
                startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                startTag.insertAdjacentHTML('afterend', finalString);
                startTag.outerHTML = '';
            }
            else {
                var selectedTextStringReversed = reverse(selectedTextString);
                if(reverse(startTagTextContent).indexOf(selectedTextStringReversed) === 0) {
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    var finalString = startTag.outerHTML + tempString;
                    startTag.insertAdjacentHTML('afterend', finalString)
                    startTag.outerHTML = '';
                }
                else {
                    var finalString =  tempString + openingTag + startTag.innerHTML.substr(endPoint);
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    finalString = endTag.outerHTML + finalString
                    startTag.insertAdjacentHTML('afterend', finalString);
                    startTag.outerHTML = '';
                }
            }

        }
    }
}

function underline() {
    var formatted = false;
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        var endTag = range.endContainer.parentNode;
        var outerNode = null;
        var selectedText = "";
        var nodeCounter = 0;
        var condition = 0;

        while(typeof(range.cloneContents().childNodes[nodeCounter]) !== 'undefined') {
            if(typeof(range.cloneContents().childNodes[nodeCounter].outerHTML) !== 'undefined') {
                selectedText += range.cloneContents().childNodes[nodeCounter].outerHTML;
            }
            else if(typeof(range.cloneContents().childNodes[nodeCounter].textContent) !== 'undefined'){
                selectedText += range.cloneContents().childNodes[nodeCounter].textContent;
            }
            nodeCounter = nodeCounter + 1;
        }

        while(startTag.tagName !== "HTML" && endTag.tagName !== "HTML") {

            if(startTag.tagName === "U" || endTag.tagName === "U"){
                condition = condition + 1;
                if(startTag.firstChild === endTag.firstChild) {
                    formatted = true;
                    break;
                }
                if(condition === 2) {
                    formatted = true;
                    break;
                }
            }
            startTag = startTag.parentNode;
            endTag = endTag.parentNode;
        }

        if(!formatted) {
            if(childNodesList != null) {
                var counter = 0;
                var totalUnderlineElementNode = getNumberOfElementNode(childNodesList, "U");
                for(var j = 0; j < childNodesList.length; j++) {
                    if(childNodesList[j].tagName === "U") {
                        counter = counter + 1;
                        var parentNode = childNodesList[j].parentNode;
                        while(childNodesList[j].firstChild) {
                            outerNode = childNodesList[j].firstChild;
                            if(childNodesList[childNodesList.length - 1].tagName === "U") {
                                break;
                            }
                            if(!selectedText.includes("<u>")) {
                                break;
                            }
                            if( startTag.tagName === "HTML" ||startTag.tagName === "BODY" || startTag.tagName === "B" || startTag.tagName === "I" || startTag.tagName === "SPAN" || startTag.tagName === "DIV") {
                                while(parentNode.tagName !== "BODY") {
                                    if(childNodesList[j].nextSibling === null || childNodesList[j].nextSibling.nodeType === 3) {
                                        break;
                                    }
                                    else {
                                        if(parentNode.tagName === "B") {
                                            const newNode = document.createElement('b');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;
                                        }
                                        else if(parentNode.tagName === "I") {
                                            const newNode = document.createElement('i');
                                            newNode.appendChild(outerNode);
                                            outerNode = newNode;

                                        }
                                        while(parentNode.firstChild) {
                                            parentNode.parentNode.insertBefore(parentNode.firstChild, parentNode)
                                        }
                                        parentNode.parentNode.removeChild(parentNode);
                                        parentNode = childNodesList[j].parentNode;
                                    }
                                }
                                if((startTag.tagName === "HTML" && endTag.tagName === "BODY") && counter === totalUnderlineElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                else if((startTag.tagName === "BODY" && endTag.tagName === "HTML") && counter === totalUnderlineElementNode){
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j].nextSibling);
                                    continue;
                                }
                                else if((startTag.tagName === "HTML" && endTag.tagName === "HTML") && counter === totalUnderlineElementNode) {
                                    parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                                    continue;
                                }
                                parentNode.insertBefore(outerNode, childNodesList[j].nextSibling);
                            }
                            else {
                                parentNode.insertBefore(childNodesList[j].firstChild, childNodesList[j]);
                            }

                        }
                        if(childNodesList[childNodesList.length - 1].tagName !== "U" && selectedText.includes("<u>")) {
                            parentNode.removeChild(childNodesList[j]);
                        }
                    }
                }

            }
            const newNode = document.createElement('u');
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
        }
        else {
            var selectedTextString = selection.toString();
            var tempString = selectedTextString;
            var openingTag = "";
            var closingTag = "";
            var startTag = range.startContainer.parentNode;
            var endTag = range.endContainer.parentNode;
            var startPoint = range.startOffset;
            var endPoint = range.endOffset;
            while(startTag.tagName !== "BODY" && endTag.tagName !== "BODY") {
                if(startTag.tagname === "U" || endTag.tagName === "U"){
                    openingTag += "<u>";
                    closingTag += "</u>";
                    break;
                } else {
                    if(startTag.tagName === "B") {
                        openingTag += "<b>";
                        closingTag += "</b>";
                    } else if(startTag.tagName === "I") {
                        openingTag += "<i>";
                        closingTag += "</i>"
                    }
                }
                startTag = startTag.parentNode;
                endTag = endTag.parentNode;
            }
            var startTagTextContent = startTag.textContent;
            startTag = range.startContainer.parentNode;
            if(startTagTextContent.indexOf(selectedTextString) === 0){
                var finalString = selectedTextString + openingTag + startTag.innerHTML.substr(endPoint);
                startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                startTag.insertAdjacentHTML('afterend', finalString);
                startTag.outerHTML = '';
            }
            else {
                var selectedTextStringReversed = reverse(selectedTextString);
                if(reverse(startTagTextContent).indexOf(selectedTextStringReversed) === 0) {
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    var finalString = startTag.outerHTML + tempString;
                    startTag.insertAdjacentHTML('afterend', finalString)
                    startTag.outerHTML = '';
                }
                else {
                    var finalString =  tempString + openingTag + startTag.innerHTML.substr(endPoint);
                    startTag.innerHTML = startTag.innerHTML.substr(0, startPoint);
                    finalString = endTag.outerHTML + finalString
                    startTag.insertAdjacentHTML('afterend', finalString);
                    startTag.outerHTML = '';
                }
            }

        }
    }
}


function changeFontStyle(font) {
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        var endTag = range.endContainer.parentNode;
        if(childNodesList !== null) {
            for(var i = 0; i < childNodesList.length; i++) {
                if(childNodesList[i].className === "font-style") {
                    const parentNode = childNodesList[i].parentNode;
                    while(childNodesList[i].firstChild) {
                        if(startTag.className ===  "font-style") {
                            break;
                        }
                        else {
                            parentNode.insertBefore(childNodesList[i].firstChild, childNodesList[i]);
                        }
                    }
                    if(startTag.className !== "font-style") {
                        parentNode.removeChild(childNodesList[i]);
                    }

                }

            }
        }
        const span = document.createElement('span');
        span.className = "font-style";
        span.style = 'font-family:' + font.value + ';'
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }
}

function changeFontSize(size) {
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        if(childNodesList !== null) {
            for(var i = 0; i < childNodesList.length; i++) {
                if(childNodesList[i].className === "font-size") {
                    const parentNode = childNodesList[i].parentNode;
                    while(childNodesList[i].firstChild) {
                        if(startTag.className ===  "font-size") {
                            break;
                        }
                        else {
                            parentNode.insertBefore(childNodesList[i].firstChild, childNodesList[i]);
                        }
                    }
                    if(startTag.className !== "font-size") {
                        parentNode.removeChild(childNodesList[i]);
                    }

                }

            }
        }
        const span = document.createElement('span');
        span.className = "font-size";
        span.style = 'font-size:' + size.value + ';'
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }
}

function changeFontColour(colour) {
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        if(childNodesList !== null) {
            for(var i = 0; i < childNodesList.length; i++) {
                if(childNodesList[i].className === "font-colour") {
                    const parentNode = childNodesList[i].parentNode;
                    while(childNodesList[i].firstChild) {
                        if(startTag.className ===  "font-colour") {
                            break;
                        }
                        else {
                            parentNode.insertBefore(childNodesList[i].firstChild, childNodesList[i]);
                        }
                    }
                    if(startTag.className !== "font-colour") {
                        parentNode.removeChild(childNodesList[i]);
                    }

                }

            }
        }
        const span = document.createElement('span');
        span.className = "font-colour";
        span.style = 'color:' + colour.value + ';'
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }
}

function textAlign(textAlignment) {
    const selection = richTextField.document.getSelection();
    if (!selection.isCollapsed){
        const range = selection.getRangeAt(0);
        var startTag = range.startContainer.parentNode;
        var firstChildNodesList = getNodesInRange(range);
        var secondChildNodesList = getNodesInRangeForSpan(range);
        var childNodesList = combineTwoNodesList(firstChildNodesList, secondChildNodesList);
        if(childNodesList !== null) {
            for(var i = 0; i < childNodesList.length; i++) {
                if(childNodesList[i].className === "text-align") {
                    const parentNode = childNodesList[i].parentNode;
                    while(childNodesList[i].firstChild) {
                        if(startTag.className ===  "text-align") {
                            break;
                        }
                        else {
                            parentNode.insertBefore(childNodesList[i].firstChild, childNodesList[i]);
                        }
                    }
                    if(startTag.className !== "text-align") {
                        parentNode.removeChild(childNodesList[i]);
                    }

                }

            }
        }
        const div = document.createElement('div');
        div.className = "text-align";
        div.style = 'text-align: ' + textAlignment;
        div.appendChild(range.extractContents());
        range.insertNode(div);
    }
}

function combineTwoNodesList(firstNodesList, secondNodesList) {
    var completeNodesList = firstNodesList;
    for(var i = 0; i < secondNodesList.length; i++) {
        var duplicated = false;
        for(var j = 0; j < completeNodesList.length; j++) {
            if(secondNodesList[i].firstChild === completeNodesList[j].firstChild) {
                duplicated = true;
                break;
            }
        }
        if(!duplicated) {
            completeNodesList.push(secondNodesList[i]);
        }
    }
    return completeNodesList;
}

function getNextNode (node, skipChildren, endNode){
    if (node.firstChild)
        return node.firstChild;
    while (node)
    {
        if (node.nextSibling)
            return node.nextSibling;
        node = node.parentNode;
    }
};

function getNodesInRange(range)
{
    var start = range.startContainer;
    var end = range.endContainer;
    var commonAncestor = range.commonAncestorContainer;
    var nodes = [];
    var node;

    // walk parent nodes from start to common ancestor
    for (node = start.parentNode; node; node = node.parentNode)
    {
        nodes.push(node);
        if (node == commonAncestor)
            break;
    }
    nodes.reverse();

    // walk children and siblings from start until end is found
    for (node = start; node; node = getNextNode(node))
    {
        nodes.push(node);
        if (node == end)
            break;
    }

    return nodes;
};


function getNodesInRangeForSpan(range)
{
    var startNode = range.startContainer.childNodes[range.startOffset]
        || range.startContainer;//it's a text node
    var endNode = range.endContainer.childNodes[range.endOffset]
        || range.endContainer;

    if (startNode == endNode && startNode.childNodes.length === 0) {
        return [startNode];
    };

    var nodes = [];
    do {
        nodes.push(startNode);
    }
    while (startNode = getNextNode(startNode, false , endNode));
    return nodes;
};

function getNumberOfElementNode(nodesList, elementNode) {
    var count = 0;
    for(var i = 0; i < nodesList.length; i++) {
        if(nodesList[i].tagName === elementNode) {
            count = count + 1;
        }
    }
    return count;
}

function reverse(s){
    return [...s].reverse().join("");
}

initializePage();
initializeChapterContent();