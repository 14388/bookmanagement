package com.bookapp.servlet.BookHandler;

public class BookHandlerFactory {
    public static Handler createHandler(String type) {
        switch(type) {
            case "create":
                return new CreateBookHandler();
            case "get-author-books":
                return new GetAuthorBooksHandler();
            case "get-chapter-list":
                return new GetChapterListHandler();
            case "create-new-chapter":
                return new CreateNewChapterHandler();
            case "get-chapter-content":
                return new GetChapterContentHandler();
            case "save-chapter-content":
                return new SaveChapterContentHandler();
            case "delete-book":
                return new DeleteBookHandler();
            case "delete-chapter":
                return new DeleteChapterHandler();
            case "change-book-name":
                return new ChangeBookNameHandler();
            case "change-chapter-name":
                return new ChangeChapterNameHandler();
            default:
                return null;
        }
    }
}
