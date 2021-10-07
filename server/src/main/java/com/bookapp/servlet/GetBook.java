package com.bookapp.servlet;

import com.bookapp.model.Book;
import com.bookapp.model.Chapter;
import com.bookapp.serivce.Book.BookService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class GetBook extends HttpServlet {
    BookService bookService = new BookService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            int bookCode = Integer.parseInt(request.getParameter("bcode"));
            Book book = bookService.get(bookCode);
            String bookName = book.getBookName();
            String authorName = book.getAuthorName();
            List<Chapter> chapterList = book.getChapterList();
            request.setAttribute("title", bookName);
            request.setAttribute("author", authorName);
            request.getRequestDispatcher("reader/index.jsp").forward(request, response);
        } catch (ServletException exception) {
            exception.printStackTrace();
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }
}
