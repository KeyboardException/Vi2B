<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Watch.aspx.cs" Inherits="Vi2B.Pages.Watch" %>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Xem Video - Vi2B</title>

        <!-- #include file="~/Fragments/header.html" -->
        <link rel="stylesheet" type="text/css" media="screen" href="/static/css/video.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="/static/css/watch.css" />
    </head>

    <body>
        <nav id="navbar"></nav>

        <div id="app">
            <span class="view">
                <span class="main">
                    <div id="VideoPlayer"></div>
    
                    <div id="VideoName" class="name" runat="server"></div>
                    <div id="VideoInfo" class="info" runat="server"></div>
                    <div id="VideoAuthor" class="author" runat="server"></div>
                </span>
                
                <span id="NextVideos" class="next" runat="server"></span>
            </span>
        </div>
        
        <!-- #include file="~/Fragments/footer.html" -->
        <script src="/static/js/video.js" type="text/javascript"></script>
        <script src="/static/js/watch.js" type="text/javascript"></script>
    </body>
</html>
