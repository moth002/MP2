angular.module('mobilePhlebotomy')
    .controller("HeaderBtnCtrl", [
        '$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', 'editMainListService',
            function ($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup, editMainListService) {

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnEditList = function() {
                    editMainListService.setEditAllowed();
                    $scope.$emit('handleEmit', { message: editMainListService.getEditAllowed() });
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