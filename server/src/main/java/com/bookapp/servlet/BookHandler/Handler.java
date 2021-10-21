package com.bookapp.servlet.BookHandler;

import com.bookapp.serivce.Book.BookService;
import com.fasterxml.jackson.databind.JsonNode;

import javax.servlet.http.HttpServletResponse;

public interface Handler {
    void handleRequest(JsonNode readJSON, HttpServletResponse response);
}
