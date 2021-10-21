package com.bookapp.servlet.BookHandler;

import com.bookapp.model.Chapter;
import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

public class GetChapterListHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        int bookCode = readJSON.get("bookCode").asInt();
        List<Chapter> chapterTitleList = bookService.getChapterTitleList(bookCode);
        jsonUtil.writeObjectAsJSONResponse(response, chapterTitleList);
    }
}
