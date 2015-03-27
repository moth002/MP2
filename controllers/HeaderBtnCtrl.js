angular.module('myApp')
    .controller("HeaderBtnCtrl", [
        '$scope', '$rootScope', '$ionicSideMenuDelegate', 'cordovaReadyService',
            function ($scope, $rootScope, $ionicSideMenuDelegate, cordovaReadyService) {

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnGoBack = function () {
                    $rootScope.history.back();
                };
            }
    ]);