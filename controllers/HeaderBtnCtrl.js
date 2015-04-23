angular.module('mobilePhlebotomy')
    .controller("HeaderBtnCtrl", [
        '$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup',
            function ($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup) {

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnGoHome = function () {
                    $ionicPopup.confirm({
                        title: 'Log off',
                        template: 'Are you sure you want to Log Off?'
                    }).then(function (res) {
                        if (res) {
                            window.location = '#/';
                        }
                    });
                };
            }
    ]);