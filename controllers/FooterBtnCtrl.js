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
                    var nav = window.navigator;
                    if( this.phonegapNavigationEnabled &&
                        nav &&
                        nav.app &&
                        nav.app.backHistory ){
                        nav.app.backHistory();
                    } else {
                        window.history.back();
                    }
                };

                $scope.btnMiddle = function () {
                    $scope.middleButton.click();
                }
                
            }
    ]);