import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Books");
    }

    // this can be used to load html from server side: an ajax request to the server
    async getHtml() {
        return `
            <h1> List of All Book </h1>
            <h3>Hello World</h3>
            <p> Lorem ipsum</p>
        `;
    }


}