/*
reference from dcode: Build a Single Page Application with JavaScript (No Frameworks)
link url: https://www.youtube.com/watch?v=6BozpmSjk-Y
 */

import Books from "./views/Books.js";

// history.pushState() method adds an entry to the browser's session history stack
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {
    // define all route
    // if the path corresponding path => load the corresponding js class
    const routes = [
        { path: "/", view: () => console.log("Home screen")},
        { path: "/Books", view: Books},
        { path: "/Chapters", view: () => console.log("Viewing Chapter")}
    ];

    // match the url with the path
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });

    // from potentialMatches find the potentialMatch with isMatch === true
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    //handle not match any => return to /
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    // making an instance of view from the match
    const view = new match.route.view();


    document.querySelector(".container").innerHTML = await view.getHtml();

    console.log(match.route.view());

};

// popstate event: is fired when the active history entry changes while user navigates the session history
// => when user travel back to a state/url that they already been through
// router function again
window.addEventListener("popstate", router());

// DOMContentLoaded: an event that start when the initial HTML document has been completely loaded and parsed.
// add listener to the body. if the click triggered, the event that have the "data-link" attribute
// will have the default-event stopped (reload the page), instead of that it call the function navigateTo
// that call the router => get the path and execute the corresponding function: view()
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })
    router();
})