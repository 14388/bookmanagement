package com.bookapp.servlet;

import com.bookapp.servlet.BookHandler.BookHandlerFactory;
import com.bookapp.servlet.BookHandler.Handler;
import com.bookapp.util.JSONUtil;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
