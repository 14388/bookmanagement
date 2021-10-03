package com.bookapp.servlet;

import com.bookapp.model.Book;
import com.bookapp.serivce.Book.BookService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class ListBook extends HttpServlet {
    private BookService bookService = new BookService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<Book> bookList = bookService.getAll();
            ObjectMapper objectMapper = new ObjectMapper();
            String bookListJSON = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(bookList);


            PrintWriter printWriter = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Access-Control-Allow-Origin", "*");
            printWriter.print(bookListJSON);
            printWriter.close();

        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }
}
