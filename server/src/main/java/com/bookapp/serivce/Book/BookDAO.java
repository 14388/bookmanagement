package com.bookapp.serivce.Book;

import com.bookapp.model.Book;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.bookapp.model.Chapter;
import com.bookapp.util.DBUtil;


public class BookDAO {
    private final String getBookByCodeScript = "SELECT * FROM Book WHERE BCode = ?";
    private final String getAllChapterScript = "SELECT * FROM BookChapter WHERE BCode = ?";
    private final String getAllBookScript = "SELECT * FROM Book";
    private final String createBookScript = "INSERT INTO Book(Bname, Aname) VALUES(?, ?)";
    private final String getCreatedBookIDScript = "SELECT BCode FROM Book ORDER BY BCode DESC LIMIT 1;";
    private final String getChapterListByCodeScript = "SELECT CNum, CTitle FROM BookChapter WHERE BCode = ? ORDER BY CNum";
    private final String createChapterScript = "INSERT INTO BookChapter(BCode, CNum, CTitle, CContent) VALUES(?, ?, ?, ?)";
    private final String getChapterContentScript = "SELECT CContent FROM BookChapter WHERE BCode = ? AND CNum = ?";
    private final String saveChapterContentScript = "UPDATE BookChapter SET CContent = ? WHERE BCode = ? AND CNum = ?";

    public List<Book> getInfoAll() {
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
            preparedStatement.close();
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
            PreparedStatement preparedStatement = connection.prepareStatement(getBookByCodeScript);
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
            book.setChapterList(chapterList);
            preparedStatement.close();

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

    public List<Chapter> getChapterTitleList(int bookCode) {
        Connection connection = new DBUtil().getConnection();
        try{
            // Initialize a list of chapter
            List<Chapter> chapterTitleList = new ArrayList<Chapter>();

            // Get fields of a book
            PreparedStatement preparedStatement = connection.prepareStatement(getChapterListByCodeScript);
            preparedStatement.setInt(1, bookCode);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                int index = resultSet.getInt(1);
                String title = resultSet.getString(2);
                Chapter chapter = new Chapter(index, title, "");
                chapterTitleList.add(chapter);
            }
            preparedStatement.close();

            return chapterTitleList;
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

    public List<Book> getInfoBooks(List<Integer> bookCodeList) {
        Connection connection = new DBUtil().getConnection();
        try{
            List<Book> bookList = new ArrayList<Book>();
            Book book = new Book();

            // Get fields of a book
            PreparedStatement preparedStatement = connection.prepareStatement(getBookByCodeScript);
            ResultSet resultSet;
            for(int i = 0; i < bookCodeList.size(); i++) {
                int bookCode = bookCodeList.get(i);
                preparedStatement.setInt(1, bookCode);
                resultSet = preparedStatement.executeQuery();
                while(resultSet.next()) {
                    int BCode = resultSet.getInt(1);
                    String name = resultSet.getString(2);
                    String authorName = resultSet.getString(3);
                    book = new Book(BCode, name, authorName);
                    bookList.add(book);
                }
            }
            preparedStatement.close();
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

    public  int createNewBook(String bookName, String authorName) {
        Connection connection = new DBUtil().getConnection();
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(createBookScript);
            preparedStatement.setString(1, bookName);
            preparedStatement.setString(2, authorName);
            preparedStatement.executeUpdate();

            preparedStatement = connection.prepareStatement(getCreatedBookIDScript);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                int newBookID = resultSet.getInt(1);
                return newBookID;
            }

            return 0;
        } catch(Exception exception) {
            exception.printStackTrace();
            return -1;
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

    public void createNewChapter(int bookCode, int chapterNumber, String chapterTitle) {
        Connection connection = new DBUtil().getConnection();
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(createChapterScript);
            preparedStatement.setInt(1, bookCode);
            preparedStatement.setInt(2, chapterNumber);
            preparedStatement.setString(3, chapterTitle);
            preparedStatement.setString(4, "");
            preparedStatement.executeUpdate();
        } catch(Exception exception) {
            exception.printStackTrace();
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

    public String getChapterContent(int bookCode, int chapterNumber) {
        Connection connection = new DBUtil().getConnection();
        String content = "";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(getChapterContentScript);
            preparedStatement.setInt(1, bookCode);
            preparedStatement.setInt(2, chapterNumber);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                content = resultSet.getString(1);
            }
            return content;
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

    public void saveChapterContent(int bookCode, int chapterNumber, String content) {
        Connection connection = new DBUtil().getConnection();
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(saveChapterContentScript);
            preparedStatement.setString(1, content);
            preparedStatement.setInt(2, bookCode);
            preparedStatement.setInt(3, chapterNumber);
            preparedStatement.executeUpdate();
        } catch(Exception exception) {
            exception.printStackTrace();
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
