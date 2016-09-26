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


            function Ball(boardWidth, boardHeight)
            {
                this.x = boardWidth  / 2;
                this.y = boardHeight / 2;
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

            Ball.prototype.update = function(paddle1, paddle2, boardWidth, boardHeight, scope)
            {
                this.x += this.xSpeed;
                this.y += this.ySpeed;

                var ballLeftEdge   = this.x - 5,
                    ballRightEdge  = this.x + 5,
                    ballTopEdge    = this.y - 5,
                    ballBottomEdge = this.y + 5;

                var paddle1RightEdge  = paddle1.x + paddle1.width,
                    paddle1TopEdge    = paddle1.y,
                    paddle1BottomEdge = paddle1.y + paddle1.height;

                var paddle2LeftEdge   = paddle2.x,
                    paddle2TopEdge    = paddle2.y,
                    paddle2BottomEdge = paddle2.y + paddle2.height;

                if (ballTopEdge <= 0) // hitting top wall
                {
                    this.y = 5;
                    this.ySpeed = -this.ySpeed;
                }
                else if (ballBottomEdge >= boardHeight) // hitting bottom wall
                {
                    this.y = boardHeight - 5;
                    this.ySpeed = -this.ySpeed;
                }

                if (this.x < 0) // point scored - reset ball
                {
                    this.xSpeed = 3;
                    this.ySpeed = 0;
                    this.x = boardWidth / 2;
                    this.y = boardHeight / 2;

                    scope.$apply(function()
                    {
                        scope.playerScore += 1;

                        if (scope.playerScore > 10)
                        {
                            scope.playerWin = true;
                        }
                    });
                }
                else if (this.x > boardWidth) // point scored - reset ball
                {
                    this.xSpeed = -3;
                    this.ySpeed = 0;
                    this.x = boardWidth / 2;
                    this.y = boardHeight / 2;

                    scope.$apply(function()
                    {
                        scope.computerScore += 1;

                        if (scope.computerScore > 10)
                        {
                            scope.computerWin = true;
                        }
                    });
                }

                if (this.x > boardWidth / 2) // ball is in player's half
                {
                    if (ballRightEdge >= paddle2LeftEdge
                        && ballTopEdge < paddle2BottomEdge
                        && ballBottomEdge > paddle2TopEdge)
                    {
                        // hit the player's paddle
                        this.xSpeed = -3;
                        this.ySpeed += (paddle2.ySpeed / 2);
                        this.x += this.xSpeed;
                    }
                }
                else // ball is in computer's half
                {
                    if (ballLeftEdge <= paddle1RightEdge
                        && ballTopEdge < paddle1BottomEdge
                        && ballBottomEdge > paddle1TopEdge)
                    {
                        // hit the computer's paddle
                        this.xSpeed = 3;
                        this.ySpeed += (paddle1.ySpeed / 2);
                        this.x += this.xSpeed;
                    }
                }
            };


            function Paddle(x, y, paddleWidth, paddleHeight)
            {
                this.x = x;
                this.y = y;
                this.width  = paddleWidth;
                this.height = paddleHeight;
                this.xSpeed = 0;
                this.ySpeed = 0;
            }


            Paddle.prototype.render = function(context)
            {
                context.fillStyle = "#FFFFFF";
                context.fillRect(this.x, this.y, this.width, this.height)
            };


            Paddle.prototype.move = function(diffX, diffY, boardHeight)
            {
                this.x += diffX;
                this.y += diffY;
                this.xSpeed = diffX;
                this.ySpeed = diffY;

                if (this.y < 0) // stop paddle at top of board
                {
                    this.y = 0;
                    this.ySpeed = 0;
                }
                else if (this.y + this.height >= boardHeight) // stop paddle at bottom of board
                {
                    this.y = boardHeight - this.height;
                    this.ySpeed = 0;
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


            Computer.prototype.update = function(ball, boardHeight)
            {
                if (ball.y < this.paddle.y)
                {
                    this.paddle.move(0, -4, boardHeight);
                }
                else if (ball.y > this.paddle.y + this.paddle.height)
                {
                    this.paddle.move(0, 4, boardHeight);
                }
            };


            function Player()
            {
                this.paddle = new Paddle(450, 210, 10, 80);
            };


            Player.prototype.render = function(context)
            {
                this.paddle.render(context);
            };


            Player.prototype.update = function(keysDown, boardHeight)
            {
                for (var key in keysDown)
                {
                    var value = parseInt(key, 10);

                    if (value === 38)
                    {
                        this.paddle.move(0, -4, boardHeight); // move 4px up
                    }
                    else if (value === 40)
                    {
                        this.paddle.move(0, 4, boardHeight); // move 4px down
                    }
                }
            };


            return {
                "templateUrl" : "templates/directives/pong_game.html",
                "replace"     : true,
                "restrict"    : "EAC",
                // "scope"       : { },

                link: function(scope, element, attributes)
                {
                    scope.playerScore   = 0;
                    scope.computerScore = 0;
                    scope.playerWin     = false;
                    scope.computerWin   = false;

                    var canvas      = element[0],
                        context     = canvas.getContext("2d"),
                        boardWidth  = canvas.width  = 500, // Todo: Resize canvas according to window size
                        boardHeight = canvas.height = 500,
                        player      = new Player(),
                        computer    = new Computer(),
                        ball        = new Ball(boardWidth, boardHeight);

                    var renderBoard = function()
                    {
                        context.fillStyle = "#000000"
                        context.fillRect(0, 0, boardWidth, boardHeight);
                        player.render(context);
                        computer.render(context);
                        ball.render(context);
                    };


                    var update = function()
                    {
                        player.update(keysDown, boardHeight);
                        computer.update(ball, boardHeight);
                        ball.update(computer.paddle, player.paddle, boardWidth, boardHeight, scope);
                    };


                    var step = function()
                    {
                        if (scope.playerScore < 11 && scope.computerScore < 11)
                        {
                            update();
                            renderBoard();
                            animate(step);
                        }
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
