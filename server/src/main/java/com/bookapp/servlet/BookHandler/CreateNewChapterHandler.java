package com.bookapp.servlet.BookHandler;

import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;

public class CreateNewChapterHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        int bookCode = readJSON.get("bookCode").asInt();
        int chapterNumber = readJSON.get("chapterNumber").asInt();
        String chapterTitle = readJSON.get("chapterTitle").asText();
        bookService.createNewChapter(bookCode, chapterNumber, chapterTitle);
        String message = "CREATED";
        jsonUtil.writeObjectAsJSONResponse(response, message);
    }
}
