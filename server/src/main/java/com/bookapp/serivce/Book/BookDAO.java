package com.bookapp.serivce.Book;

import com.bookapp.model.Book;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.bookapp.model.Chapter;
import com.bookapp.util.DBUtil;



public class BookDAO {
    private String getByCodeScript = "SELECT * FROM Book WHERE BCode = ?";
    private String getAllChapterScript = "SELECT * FROM BookChapter WHERE BCode = ?";
    private String getAllBookScript = "SELECT * FROM Book";

    public List<Book> getAll() {
        Connection connection = new DBUtil().getConnection();
        try{
            List<Book> bookList = new ArrayList<Book>();
            Book book = new Book();

            // Get fields of a book
            PreparedStatement preparedStatement = connection.prepareStatement(getAllBookScript);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                int BCode = resultSet.getInt(1);
                String name = resultSet.getString(2);
                String authorName = resultSet.getString(3);
                book = new Book(BCode, name, authorName);
                bookList.add(book);
            }
            return bookList;
        } catch (Exception exception) {
            exception.printStackTrace();
            return null;
        } finally{
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException sqlException) {
                    sqlException.printStackTrace();
                }
            }
        }
    }

    public Book get(int bookCode) {
        Connection connection = new DBUtil().getConnection();
        try{
            // New instance of book
            Book book = new Book();

            // Get fields of a book
            PreparedStatement preparedStatement = connection.prepareStatement(getByCodeScript);
            preparedStatement.setInt(1, bookCode);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                int BCode = resultSet.getInt(1);
                String name = resultSet.getString(2);
                String authorName = resultSet.getString(3);
                book = new Book(BCode, name, authorName);
            }

            // Get chapters of the book
            List<Chapter> chapterList = new ArrayList<Chapter>();
            preparedStatement = connection.prepareStatement(getAllChapterScript);
            preparedStatement.setInt(1, bookCode);
            resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                int index = resultSet.getInt(2);
                String title = resultSet.getString(3);
                String content = resultSet.getString(4);
                Chapter chapter = new Chapter(index, title, content);
                chapterList.add(chapter);
            }

            // Add chapters to the book
            book.setChapterList(chapterList);

            return book;
        } catch(Exception exception) {
            exception.printStackTrace();
            return null;
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException sqlException) {
                    sqlException.printStackTrace();
                }
            }
        }
    }
}
