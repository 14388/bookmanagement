package com.bookapp.model;

import java.util.ArrayList;
import java.util.List;

public class Book {
    int code;
    String bookName;
    String authorName;
    List<Chapter> chapterList = new ArrayList<Chapter>();

    public Book() {};

    public Book(int code, String name, String authorName) {
        this.code = code;
        this.bookName = name;
        this.authorName = authorName;
    }

    public String getBookName() {
        return bookName;
    }

    public String getAuthorName() {
        return authorName;
    }

    public List<Chapter> getChapterList(){
        return chapterList;
    }

    public int getCode() {
        return code;
    }

    public void setChapterList(List<Chapter> chapterList) {
        this.chapterList = chapterList;
    }
}
