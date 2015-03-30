angular.module('myApp')
    .controller("HeaderBtnCtrl", [
        '$scope', '$rootScope', '$ionicSideMenuDelegate',
            function ($scope, $rootScope, $ionicSideMenuDelegate) {

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnGoHome = function () {
                    window.location = '#/';
                };
            }
    ]);