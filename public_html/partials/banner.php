<!DOCTYPE html>
<html>
  <head>
    <script src="/partials/js/banner.js"></script>
    <style>
      body {
        margin: 0;
      }
      #bannertxtbox {
        display: table;
        height: 14rem;
        background-color: blue;
        width: 100%;
      }
      #banner {
        position: absolute;
        display: block;
        top: 0;
        background-image: url('/partials/img/banner.jpg');
        background-size: 100% auto;
        background-position: center 50%;
        opacity: .8;
        width: 100%;
        height: 14rem;
      }
      #username {
        position: relative;
        display: table-cell;
        font-size: 3.5rem;
        font-family: Arial;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
        opacity: 1;
        z-index: 1;
      }
      #topbar {
        position: absolute;
        top: 14rem;
        height: .5rem;
        width: 100%;
        background-color: rgb(30, 30, 30);
      }
    </style>
  </head>
  <body onload="init()" onresize="resize()">
    <header>
      <canvas id="banner"></canvas>
      <div id="bannertxtbox">
        <div id="username">[ k d a i 1 7 ] $</div>
      </div>
    </header>
    <div id="topbar"></div>
  </body>
</html>
