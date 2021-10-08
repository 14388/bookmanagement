<%@ page import="com.bookapp.model.Chapter" %><%--
  Created by IntelliJ IDEA.
  User: vgbui
  Date: 07/10/2021
  Time: 9:56 SA
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Reader</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div class="menu">
    <ul>
        <li><a href="/" class="left-menu" data-link>Books</a></li>
        <li><button class="right-menu btn btn-secondary left-menu" onclick="toItalic()" >Italic</button></li>
        <li><button class="right-menu btn btn-secondary left-menu" onclick="toBold()">Bold</button></li>
    </ul>
</div>
<%
    Chapter chapter = (Chapter) request.getAttribute("chapter");
    String title = chapter.getTitle();
    int index = chapter.getIndex();
    String content = chapter.getContent();
%>
<div class="container">
        <h3><%= "Chapter " + index + " - " + title %></h3>
        <div class="chapter-content"><%=content%></div>
</div>
<script src="/reader/script.js"></script>
</body>
</html>
