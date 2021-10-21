package com.bookapp.servlet.BookHandler;

import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;

public class SaveChapterContentHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        int bookCode = readJSON.get("bookCode").asInt();
        int chapterNumber = readJSON.get("chapterNumber").asInt();
        String content = readJSON.get("content").asText();
        bookService.saveChapterContent(bookCode, chapterNumber, content);
        String message = "SAVED";
        jsonUtil.writeObjectAsJSONResponse(response, message);
    }
}
