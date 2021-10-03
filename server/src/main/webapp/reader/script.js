/* Button */
function toItalic(totalChapterNumber){
    for(var i = 1; i <= totalChapterNumber; i++) {
        document.getElementById("content" + i).style.fontStyle = "italic";
    }
}