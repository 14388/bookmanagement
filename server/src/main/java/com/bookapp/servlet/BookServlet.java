package com.bookapp.servlet;

import com.bookapp.model.Book;
import com.bookapp.model.Chapter;
import com.bookapp.serivce.Book.BookService;
import com.bookapp.servlet.BookHandler.BookHandlerFactory;
import com.bookapp.servlet.BookHandler.Handler;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class BookServlet extends HttpServlet {
    JSONUtil jsonUtil = new JSONUtil();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        JsonNode readJSON = jsonUtil.getJSONFromRequest(request);
        String type = readJSON.get("type").asText();
        Handler handler = BookHandlerFactory.createHandler(type);
        if(handler != null) {
            handler.handleRequest(readJSON, response);
        }
    }
}
