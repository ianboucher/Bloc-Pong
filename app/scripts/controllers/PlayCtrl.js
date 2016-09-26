"use strict";

angular
    .module("blocPong")
    .controller("PlayCtrl", ["$scope",
        function PlayCtrl($scope)
        {
            self = this;

            self.playerScore = 0;
            self.computerScore = 0;

            $scope.$on("playerScore", function()
            {
                $scope.$apply(function()
                {
                    self.playerScore += 1;
                });
            });

            $scope.$on("computerScore", function()
            {
                $scope.$apply(function()
                {
                    self.computerScore += 1;
                });
            })
        }]
    );
