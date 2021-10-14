package com.bookapp.model;

public class Chapter {
    int index;
    String title;
    String content;
    public Chapter() {}

    public Chapter(int index, String title, String content) {
        this.index = index;
        this.title = title;
        this.content = content;
    }

    public int getIndex() {
        return index;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
