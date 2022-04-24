<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Personal.aspx.cs" Inherits="Vi2B.Pages.Personal" %>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Trang Cá Nhân - Vi2B</title>

        <!-- #include file="~/Fragments/header.html" -->
        <link rel="stylesheet" type="text/css" media="screen" href="/static/css/index.css" />
    </head>

    <body>
        <nav id="navbar"></nav>
        <div id="app">
            <div class="videos cap-width">
                <div id="VideoCards" class="content" runat="server"></div>
            </div>
        </div>
        
        <!-- #include file="~/Fragments/footer.html" -->
        <script src="/static/js/index.js" type="text/javascript"></script>
    </body>
</html>
