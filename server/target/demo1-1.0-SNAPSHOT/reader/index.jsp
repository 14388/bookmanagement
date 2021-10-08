<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bookapp.model.Chapter" %>
<!DOCTYPE html>
<html lang="en">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="/reader/style.css">
</head>
<body>
<%
    String bookName = (String) request.getAttribute("title");
    String author = (String) request.getAttribute("author");
    List<Chapter> chapterList = (List<Chapter>) request.getAttribute("chapterList");
%>

<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <h1> <%= "Name of the book:" + bookName %> </h1> <br/>
            <h2> <%= "Author of the book: " + author%> </h2> <br/>

            <h3> Table of contents </h3>
            <% for(Chapter chapter : chapterList) {%>
            <%
                int index = chapter.getIndex();
                String title = chapter.getTitle();
                String hrefIndex = "#C" + index;
            %>
            <p><a href="<%=hrefIndex%>"> <%="Chapter " + index + " - " + title%> </a> </p>
            <% } %>

            <div class="btn-group" role="group">
                <button onclick="toItalic()" type="button" class="btn btn-secondary first-button">Italic</button><br/>
                <button onclick="toBold()" type="button" class="btn btn-secondary other-button">Bold</button><br/>
            </div>
            <% for(Chapter chapter : chapterList) { %>
            <%
                int index = chapter.getIndex();
                String title = chapter.getTitle();
                String content = chapter.getContent();
                String id = "C" + index;
            %>
            <h3 id="<%=id%>"> <%= "Chapter " + index + " - " + title %></h3>
            <div id="<%="content" + index%>" class="chapter-content"><%=content%></div>
            <% } %>
        </div>
    </div>
</div>




<script src="/reader/script.js"></script>
</body>
</html>