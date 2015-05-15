angular.module('mobilePhlebotomy')
    .controller("FooterBtnCtrl", [
        '$scope', 'footerBtnService', 
            function ($scope, footerBtnService) {

                $scope.mainButton = footerBtnService.getMainBtn();

                $scope.btnMain = function () {
                    $scope.mainButton.click();
                };

                //$scope.btnLeft = function () {
                //    if ($scope.leftButton.click === null) {
                //        var nav = window.navigator;
                //        if (this.phonegapNavigationEnabled &&
                //            nav &&
                //            nav.app &&
                //            nav.app.backHistory) {
                //            nav.app.backHistory();
                //        } else {
                //            window.history.back();
                //        }
                //    } else {
                //        $scope.leftButton.click();
                //    }
                //};

                //$scope.btnMiddle = function () {
                //    $scope.middleButton.click();
                //}
                
            }
    ]);