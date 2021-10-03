let url_string = window.location.href;
let url = new URL(url_string);
let id = url.searchParams.get("id");

/* Get data from Backend */
let book_content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut tincidunt libero, eu mollis eros. Donec tristique ultricies magna in sagittis. Cras dictum vel purus vitae venenatis. Vivamus pellentesque lorem mauris, faucibus rutrum urna cursus vitae. Sed sit amet dictum ipsum, eget ullamcorper est. Suspendisse potenti. Vestibulum mattis, neque ut ullamcorper fermentum, nibh massa semper metus, in congue leo ante sed erat. Morbi laoreet nulla turpis, sed viverra risus volutpat id. Curabitur nulla nibh, consequat tempor viverra quis, cursus sit amet nisi. Mauris semper auctor nisl, in vulputate justo rutrum sed. Cras fermentum non quam vel placerat. In finibus pulvinar nibh, blandit congue massa pretium sit amet. Sed porttitor nec sapien vitae feugiat. Phasellus felis libero, feugiat quis turpis non, varius pretium enim. Nunc id sapien sit amet ante venenatis elementum. Pellentesque a rutrum ipsum. Mauris posuere consequat justo, in sagittis massa convallis eu. Curabitur accumsan magna id justo rhoncus fringilla. Morbi eu tellus libero. Nullam commodo, enim eget feugiat sagittis, enim neque ullamcorper tortor, a hendrerit elit nulla sed orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis sodales lorem ut pulvinar efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec vestibulum elit lobortis ex hendrerit mollis. Suspendisse venenatis semper lacus porttitor rhoncus. Maecenas faucibus porttitor massa a vulputate. Sed ipsum mauris, elementum sit amet nunc sed, mattis fringilla justo.';


/* Display data */
document.getElementById("book-content").innerHTML = book_content;


/* Button */
function toItalic(){
    document.getElementById("book-content").style.fontStyle = "italic";
}