/* Button */
let isBold = false;
let isItalic = false;

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