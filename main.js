(function() {
  "use strict";

  var Game = function(canvasElementId) {
    this.canvas = document.getElementById(canvasElementId);

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.context = this.canvas.getContext && this.canvas.getContext("2d");
    if (!this.context) window.alert("your browser does not support canvas!");

    this.screens = [];
  };

  Game.prototype.loop = function() {
    var that = this;
    var dt  = 30/1000;
    var len = this.screens.length;

    for (var i=0; i<len; i++) {
      if (this.screens[i]) {
        this.screens[i].draw(dt, this.context);
      }
    }

    setTimeout(function() { that.loop(); }, 30);
  };

  Game.prototype.setScreen = function(num, screen) {
    this.screens[num] = screen;
  };

  var game = new Game("game");

  // http://jsperf.com/prerendered-starfield
  var StarsScreen = function(speed, opacity, numStars, clear) {
    this.stars = document.createElement("canvas");
    this.stars.width = game.width;
    this.stars.height = game.height;
    this.starCtx = this.stars.getContext("2d");
    this.speed = speed;
    this.offset = 0;

    if (clear) {
      this.starCtx.fillStyle = "#000";
      this.starCtx.fillRect(0, 0, game.width, game.height);
    }

    this.starCtx.fillStyle = "#FFF";
    this.starCtx.globalAlpha = opacity;

    for (var i=0; i<numStars; i++) {
      this.starCtx.fillRect(Math.floor(Math.random() * game.width), Math.floor(Math.random() * game.height), 2, 2);
    }
  };

  StarsScreen.prototype.draw = function(dt, ctx) {
    this.offset += dt * this.speed;
    this.offset = this.offset % game.height;
    var intOffset = Math.floor(this.offset);
    var remaining = game.height - intOffset;

    // top half
    if (intOffset > 0) ctx.drawImage(this.stars, 0, remaining, game.width, intOffset, 0, 0, game.width, intOffset);

    // bottom half
    if (remaining > 0) ctx.drawImage(this.stars, 0, 0, game.width, remaining, 0, intOffset, game.width, remaining);
  };

  var TitleScreen = function TitleScreen(title, subtitle) {
    this.title = title;
    this.subtitle = subtitle;
    this.shadowColor = "#FF0000";
    this.color = "#FFF03F";
  };

  TitleScreen.prototype.draw = function(dt, ctx) {
    ctx.textAlign = "center";
    ctx.font = "bold 50px Unica One";
    this.drawText(ctx, this.title, game.width/2, game.height/2);
    ctx.font = "bold 28px Unica One";
    this.drawText(ctx, this.subtitle, game.width/2, game.height/2 + 40);
  };

  TitleScreen.prototype.drawText = function(ctx, text, x, y) {
    ctx.fillStyle = this.shadowColor;
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillStyle = this.color;
    ctx.fillText(text, x, y);
  };

  window.addEventListener("load", function() {
    game.setScreen(0, new StarsScreen(20, 0.4, 100, true));
    game.setScreen(1, new StarsScreen(50, 0.6, 100));
    game.setScreen(2, new StarsScreen(100, 1.0, 50));
    game.setScreen(3, new TitleScreen("Green Aliens","from outer space"));
    game.loop();
  });

})();
