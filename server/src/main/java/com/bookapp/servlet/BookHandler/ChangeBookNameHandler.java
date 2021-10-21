package com.bookapp.servlet.BookHandler;

import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;

public class ChangeBookNameHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        int bookCode = readJSON.get("bookCode").asInt();
        String newBookName = readJSON.get("newBookName").asText();
        bookService.changeBookName(bookCode, newBookName);
        String message = "SUCCESS";
        jsonUtil.writeObjectAsJSONResponse(response, message);
    }
}
