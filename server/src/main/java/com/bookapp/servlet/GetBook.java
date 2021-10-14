package com.bookapp.servlet;
import com.bookapp.model.Book;
import com.bookapp.model.Chapter;
import com.bookapp.serivce.Book.BookService;
import com.bookapp.util.JSONUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
public class GetBook extends HttpServlet {
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        int bookCode = Integer.parseInt(request.getParameter("bcode"));
        Book book = bookService.get(bookCode);
        jsonUtil.writeObjectAsJSONResponse(response, book);
    }
}