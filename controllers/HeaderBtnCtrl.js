angular.module('mobilePhlebotomy')
    .controller("HeaderBtnCtrl", [
        '$scope', '$ionicSideMenuDelegate', '$ionicPopup', 'headerBtnService',
            function ($scope, $ionicSideMenuDelegate, $ionicPopup, headerBtnService) {

                $scope.editButton = headerBtnService.getEditButton();

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnEditList = function () {
                    $scope.editButton.click();
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