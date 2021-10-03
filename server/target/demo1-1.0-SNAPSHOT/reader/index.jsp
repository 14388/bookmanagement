<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bookapp.model.Chapter" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book Reader</title>
</head>
<body>
<%
    String bookName = (String) request.getAttribute("title");
    String author = (String) request.getAttribute("author");
    List<Chapter> chapterList = (List<Chapter>) request.getAttribute("chapterList");
%>

<h1> <%= "Name of the book:" + bookName %> </h1> <br/>
<h2> <%= "Author of the book: " + author%> </h2> <br/>

<h3> Table of contents </h3>
<% for(Chapter chapter : chapterList) {%>
<%
    int index = chapter.getIndex();
    String title = chapter.getTitle();
    String hrefIndex = "#C" + index;
%>
<p><a href="<%=hrefIndex%>"> <%=index + "-" + title%> </a> </p>
<% } %>

<% for(Chapter chapter : chapterList) { %>
<%
    int index = chapter.getIndex();
    String title = chapter.getTitle();
    String content = chapter.getContent();
    String id = "C" + index;
%>
<h3 id="<%=id%>"> <%= index + "-" + title %></h3>
<%=content%>
<% } %>

</body>
</html>