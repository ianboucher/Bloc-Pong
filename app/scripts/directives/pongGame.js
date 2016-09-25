"use strict"

angular
    .module("blocPong")
    .directive("pongGame", ["$document",
        function pongGame($document)
        {
            var animate = window.requestAnimationFrame       ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame    ||
                          window.oRequestAnimationFrame      ||
                          window.msRequestAnimationFrame     ||
                          function(callback)
                          {
                              window.setTimeout(callback, 1000/60)
                          };


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


            Paddle.prototype.move = function(x, y, height)
            {
                this.x += x;
                this.y += y;
                this.xSpeed = x;
                this.ySpeed = y;

                if (this.y < 0) // stop paddle at top of board
                {
                    this.y = 0;
                    this.ySpeed = 0;
                }
                else if (this.y > height) // stop paddle at bottom of board
                {
                    this.y = height;
                    this.ySpeed = 0;
                }
            };


            function Ball(x, y)
            {
                this.x = x / 2;
                this.y = y / 2;
                this.xSpeed = 3;
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

            Ball.prototype.update = function(paddle1, paddle2, width, height)
            {
                this.x += this.xSpeed;
                this.y += this.ySpeed;

                var ballLeftEdge   = this.x - 5,
                    ballRightEdge  = this.x + 5,
                    ballTopEdge    = this.y - 5,
                    ballBottomEdge = this.y + 5;

                if (this.y - 5 < 0) // hitting top wall
                {
                    this.y = 5;
                    this.ySpeed = -this.xSpeed;
                }
                else if (this.y + 5 > height) // hitting bottom wall
                {
                    this.y = height - 5;
                    this.ySpeed = -this.ySpeed;
                }

                if (this.x < 0 || this.x > width) // point scored - reset ball
                {
                    this.xSpeed = 3;
                    this.ySpeed = 0;
                    this.x = width / 2;
                    this.y = height / 2;
                }

                if (this.x > width / 2) // ball is in player's half
                {
                    if (ballRightEdge >= paddle2.x
                        && ballBottomEdge < (paddle2.y + paddle2.height)
                        && ballTopEdge > paddle2.y)
                    {
                        // hit the player's paddle
                        this.xSpeed = -3;
                        this.ySpeed += (paddle2.ySpeed / 2);
                        this.x += this.xSpeed;
                    }
                }
                else
                {
                    if (ballLeftEdge <= (paddle1.x + paddle1.width)
                        && ballBottomEdge < (paddle1.y + paddle1.height)
                        && ballTopEdge > paddle1.y)
                    {
                        // hit the computer's paddle
                        this.xSpeed = 3;
                        this.ySpeed += (paddle1.ySpeed / 2);
                        this.x += this.xSpeed;
                    }
                }
            };


            function Computer()
            {
                this.paddle = new Paddle(50, 210, 10, 80);
            };

            Computer.prototype.render = function(context)
            {
                this.paddle.render(context);
            };


            function Player()
            {
                this.paddle = new Paddle(450, 210, 10, 80);
            };


            Player.prototype.render = function(context)
            {
                this.paddle.render(context);
            };


            Player.prototype.update = function(keysDown, height)
            {
                for (var key in keysDown)
                {
                    var value = parseInt(key, 10);

                    if (value === 38)
                    {
                        this.paddle.move(0, -4, height); // move 4px up
                    }
                    else if (value === 40)
                    {
                        this.paddle.move(0, 4, height); // move 4px down
                    }
                }
            };


            return {
                "templateUrl" : "templates/directives/pong_game.html",
                "replace"     : true,
                "restrict"    : "EAC",
                "scope"       : { },

                link: function(scope, element, attributes)
                {
                    var canvas   = element[0],
                        context  = canvas.getContext("2d"),
                        width    = canvas.width  = 500,
                        height   = canvas.height = 500,
                        player   = new Player(),
                        computer = new Computer(),
                        ball     = new Ball(width, height);

                    var renderBoard = function()
                    {
                        context.fillStyle = "#000000"
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        player.render(context);
                        computer.render(context);
                        ball.render(context);
                    };

                    renderBoard();

                    var update = function()
                    {
                        player.update(keysDown, height);
                        ball.update(computer.paddle, player.paddle, canvas.width, canvas.height);
                    };


                    var step = function()
                    {
                        update();
                        renderBoard();
                        animate(step);
                    };

                    step(); //-------------------------------------------------- ToDo: Trigger with button

                    var keysDown = {};

                    $document.on("keydown", function addKeyCode(event)
                    {
                        keysDown[event.keyCode] = true;
                    });

                    $document.on("keyup", function removeKeyCode(event)
                    {
                        delete keysDown[event.keyCode];
                    });
                }
            }
        }]
    );
