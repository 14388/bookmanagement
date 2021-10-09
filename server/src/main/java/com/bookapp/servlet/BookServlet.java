package com.bookapp.servlet;

import com.bookapp.model.Book;
import com.bookapp.model.Chapter;
import com.bookapp.serivce.Book.BookService;
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
    BookService bookService = new BookService();
    JSONUtil jsonUtil = new JSONUtil();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            int bookCode = Integer.parseInt(request.getParameter("bcode"));
            Book book = bookService.get(bookCode);
            String bookName = book.getBookName();
            String authorName = book.getAuthorName();
            List<Chapter> chapterList = book.getChapterList();
            System.out.println(chapterList.size());
            request.setAttribute("title", bookName);
            request.setAttribute("author", authorName);
            request.setAttribute("chapterList", chapterList);
            request.getRequestDispatcher("reader/index.jsp").forward(request, response);
        } catch (ServletException exception) {
            exception.printStackTrace();
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        try {
            JsonNode readJSON = jsonUtil.getJSONFromRequest(request);
            String type = readJSON.get("type").asText();

            if(type.equals("create")) {
                String bookName = readJSON.get("bookName").asText();
                String authorName = readJSON.get("authorName").asText();

                int newBookID = bookService.createNewBook(bookName, authorName);
                String newBookIDJSON = ("{\"newBookID\": \" " + newBookID + " \"}");

                jsonUtil.writeCreatedJSONToResponse(response, newBookIDJSON);
            }
            else if (type.equals("get-author-books")) {
                ObjectMapper objectMapper = new ObjectMapper();
                String bookCodeListJSON = readJSON.get("bookCodeList").toString();
                List<Integer> bookCodeList = objectMapper.readValue(bookCodeListJSON, new TypeReference<List<Integer>>() {});
                List<Book> bookList = bookService.getInfoBooks(bookCodeList);
                jsonUtil.writeObjectAsJSONResponse(response, bookList);
            }
            else if (type.equals("get-chapter-list")) {
                int bookCode = readJSON.get("bookCode").asInt();
                List<Chapter> chapterTitleList = bookService.getChapterTitleList(bookCode);
                jsonUtil.writeObjectAsJSONResponse(response, chapterTitleList);
            }
            else if(type.equals("create-new-chapter")) {
                int bookCode = readJSON.get("bookCode").asInt();
                int chapterNumber = readJSON.get("chapterNumber").asInt();
                String chapterTitle = readJSON.get("chapterTitle").asText();
                bookService.createNewChapter(bookCode, chapterNumber, chapterTitle);
                String message = "CREATED";
                jsonUtil.writeObjectAsJSONResponse(response, message);
            }
            else if(type.equals("get-chapter-content")) {
                int bookCode = readJSON.get("bookCode").asInt();
                int chapterNumber = readJSON.get("chapterNumber").asInt();
                String content = bookService.getChapterContent(bookCode, chapterNumber);
                jsonUtil.writeObjectAsJSONResponse(response, content);
            }
            else if(type.equals("save-chapter-content")) {
                int bookCode = readJSON.get("bookCode").asInt();
                int chapterNumber = readJSON.get("chapterNumber").asInt();
                String content = readJSON.get("content").asText();
                bookService.saveChapterContent(bookCode, chapterNumber, content);
                String message = "SAVED";
                jsonUtil.writeObjectAsJSONResponse(response, message);
            }
            else if(type.equals("delete-book")) {
                int bookCode = readJSON.get("bookCode").asInt();
                bookService.deleteBook(bookCode);
                String messsage = "SUCCESS";
                jsonUtil.writeObjectAsJSONResponse(response, messsage);
            }
            else if(type.equals("delete-chapter")) {
                int bookCode = readJSON.get("bookCode").asInt();
                int chapterNumber = readJSON.get("chapterNumber").asInt();
                bookService.deleteChapter(bookCode, chapterNumber);
                String message = "SUCCESS";
                jsonUtil.writeObjectAsJSONResponse(response, message);
            }
            else if(type.equals("change-book-name")) {
                int bookCode = readJSON.get("bookCode").asInt();
                String newBookName = readJSON.get("newBookName").asText();
                bookService.changeBookName(bookCode, newBookName);
                String message = "SUCCESS";
                jsonUtil.writeObjectAsJSONResponse(response, message);
            }
            else if(type.equals("change-chapter-name")) {
                int bookCode = readJSON.get("bookCode").asInt();
                int chapterNumber = readJSON.get("chapterNumber").asInt();
                String newChapterName = readJSON.get("newChapterName").asText();
                bookService.changeChapterName(bookCode, chapterNumber, newChapterName);
                String message = "SUCCESS";
                jsonUtil.writeObjectAsJSONResponse(response, message);
            }

        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }
}
