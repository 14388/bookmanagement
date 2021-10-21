package com.bookapp.servlet.BookHandler;

import com.bookapp.model.Book;
import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class GetAuthorBooksHandler implements Handler{
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    public void handleRequest(JsonNode readJSON, HttpServletResponse response){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            String bookCodeListJSON = readJSON.get("bookCodeList").toString();
            List<Integer> bookCodeList = objectMapper.readValue(bookCodeListJSON, new TypeReference<List<Integer>>() {});
            List<Book> bookList = bookService.getInfoBooks(bookCodeList);
            jsonUtil.writeObjectAsJSONResponse(response, bookList);
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }
}
