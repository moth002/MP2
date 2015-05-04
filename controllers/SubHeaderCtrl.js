angular.module('mobilePhlebotomy')
    .controller("SubHeaderCtrl", [
        '$scope', '$ionicSideMenuDelegate', '$ionicPopup', 'subHeaderService',
            function ($scope, $ionicSideMenuDelegate, $ionicPopup, subHeaderService) {

                $scope.subHeader = subHeaderService.getSubHeader();

                //$scope.btnSideMenu = function () {
                //    $ionicSideMenuDelegate.toggleLeft();
                //};

                //$scope.btnEditList = function () {
                //    $scope.editButton.click();
                //};

                //$scope.btnGoHome = function () {
                //    $ionicPopup.confirm({
                //        title: 'Log off',
                //        template: 'Are you sure you want to Log Off?'
                //    }).then(function (res) {
                //        if (res) {
                //            window.location = '#/';
                //        }
                //    });
                //};
            }
    ]);