package com.bookapp.serivce.Book;

import com.bookapp.model.Book;

import java.util.List;

public class BookService {
    BookDAO bookDAO = new BookDAO();

    public List<Book> getAll() {
        return bookDAO.getAll();
    }

    public Book get(int bookCode) {
        Book book = bookDAO.get(bookCode);
        return book;
    }
}
