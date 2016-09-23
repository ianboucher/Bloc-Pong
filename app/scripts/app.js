"use strict";

angular
    .module("blocPong", ["ui.router"])
    .config(function($stateProvider, $locationProvider)
    {
        $locationProvider
            .html5Mode
            ({
                enabled: true,
                requireBase: false
            });

        $stateProvider
            .state
            (
                "landing",
                {
                    url         : "/",
                    controller  : "LandingCtrl as landing",
                    templateUrl : "/templates/landing.html"
                }
            )
            .state
            (
                "play",
                {
                    url         : "/play",
                    controller  : "PlayCtrl as play",
                    templateUrl : "/templates/play.html"
                }
            )
    });
