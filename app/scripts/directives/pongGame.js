"use strict"

angular
    .module("blocPong")
    .directive("pongGame",
        function pongGame()
        {
            function Paddle(x, y, width, height)
            {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.xSpeed = 0;
                this.ySpeed = 0;
            }


            Paddle.prototype.render = function(context)
            {
                context.fillStyle = "#FFFFFF";
                context.fillRect(this.x, this.y, this.width, this.height)
            };


            function Ball(x, y)
            {
                this.x = 250;
                this.y = 250;
                this.xSpeed = 0;
                this.ySpeed = 0;
                this.radius = 5;
            }

            Ball.prototype.render = function(context)
            {
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
                context.fillStyle = "#FFFFFF";
                context.fill();
            }


            function Player()
            {
                this.paddle = new Paddle(50, 210, 10, 80);
            };


            function Computer()
            {
                this.paddle = new Paddle(450, 210, 10, 80);
            };


            Player.prototype.render = function(context)
            {
                this.paddle.render(context);
            };


            Computer.prototype.render = function(context)
            {
                this.paddle.render(context);
            };


            return {
                "templateUrl" : "templates/directives/pong_game.html",
                "replace"     : true,
                "restrict"    : "EAC",
                "scope"       : { },

                link: function(scope, element, attributes)
                {
                    var canvas = element[0],
                        context = canvas.getContext("2d");

                    canvas.width  = 500;
                    canvas.height = 500;

                    var player   = new Player(),
                        computer = new Computer(),
                        ball     = new Ball();

                    var renderGame = function()
                    {
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        player.render(context);
                        computer.render(context);
                        ball.render(context);
                    };

                    renderGame();
                }
            }
        });
