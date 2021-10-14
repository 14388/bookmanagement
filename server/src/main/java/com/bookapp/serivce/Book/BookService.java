package com.bookapp.serivce.Book;

import com.bookapp.model.Book;
import com.bookapp.model.Chapter;

import java.util.List;

public class BookService {
    BookDAO bookDAO = new BookDAO();

    public List<Book> getAll() {
        return bookDAO.getInfoAll();
    }

    public Book get(int bookCode) {
        Book book = bookDAO.get(bookCode);
        return book;
    }

    public int createNewBook(String bookName, String authorName) {
        int newBookID = bookDAO.createNewBook(bookName, authorName);
        return newBookID;
    }

    public List<Book> getInfoBooks(List<Integer> bookCodeList) {
        List<Book> bookList = bookDAO.getInfoBooks(bookCodeList);
        return bookList;
    }

    public List<Chapter> getChapterTitleList(int bookCode) {
        List<Chapter> chapterTitleList = bookDAO.getChapterTitleList(bookCode);
        return chapterTitleList;
    }

    public void createNewChapter(int bookCode, int chapterNumber, String chapterTitle) {
        bookDAO.createNewChapter(bookCode, chapterNumber, chapterTitle);
    }

    public String getChapterContent(int bookCode, int chapterNumber) {
        return bookDAO.getChapterContent(bookCode, chapterNumber);
    }

    public void saveChapterContent(int bookCode, int chapterNumber, String content) {
        bookDAO.saveChapterContent(bookCode, chapterNumber, content);
    }

    public void changeBookName(int bookCode, String newBookName) {
        bookDAO.changeBookName(bookCode, newBookName);
    }

    public void changeChapterName(int bookCode, int chapterNumber, String newChapterName) {
        bookDAO.changeChapterName(bookCode, chapterNumber, newChapterName);
    }

    public void deleteChapter(int bookCode, int chapterNumber) {
        bookDAO.deleteChapter(bookCode, chapterNumber);
    }

    public void deleteBook(int bookCode) {
        bookDAO.deleteBook(bookCode);
    }

    public Chapter getChapter(int bookCode, int chapterNumber) {
        return bookDAO.getChapter(bookCode, chapterNumber);
    }
}
