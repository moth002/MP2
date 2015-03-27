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
                   // cordovaReadyService(navigator.notification.alert(
                   //    'You are the winner!',  // message
                   //    alertDismissed,         // callback
                   //    'Game Over',            // title
                   //    'Done'                  // buttonName
                    //));
                    //notificationDlgService.alertDialog();
                    window.location = '#/';
                };

                $scope.btnMiddle = function () {
                    $scope.middleButton.click();
                    //labelPrintService.print();
                    //labelPrintService.print('Cold, Power PRP1660', 'Male, 23-Jan-1980.   Purple Top, 10ml', 'DB0010H001');
                }
                
            }
    ]);