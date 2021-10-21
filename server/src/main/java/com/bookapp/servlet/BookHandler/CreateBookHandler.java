package com.bookapp.servlet.BookHandler;

import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;

public class CreateBookHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        String bookName = readJSON.get("bookName").asText();
        String authorName = readJSON.get("authorName").asText();

        int newBookID = bookService.createNewBook(bookName, authorName);
        String newBookIDJSON = ("{\"newBookID\": \" " + newBookID + " \"}");

        jsonUtil.writeCreatedJSONToResponse(response, newBookIDJSON);
    }
}
