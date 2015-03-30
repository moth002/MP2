angular.module('myApp')
    .controller("FooterBtnCtrl", [
        '$scope', 'footerBtnService', 'globalIdService', 'notificationDlgService',
            function ($scope, footerBtnService, globalIdService, notificationDlgService) {

                $scope.idList = globalIdService.getIDs;

                $scope.rightButton = footerBtnService.getRight();
                $scope.middleButton = footerBtnService.getMiddle();
                $scope.leftButton = footerBtnService.getLeft();

                $scope.btnRight = function () {
                    $scope.rightButton.click();
                };

                $scope.btnLeft = function () {
                    window.location = '#/';
                };

                $scope.btnMiddle = function () {
                    $scope.middleButton.click();
                }
                
            }
    ]);