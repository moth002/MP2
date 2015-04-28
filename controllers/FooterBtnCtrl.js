angular.module('mobilePhlebotomy')
    .controller("FooterBtnCtrl", [
        '$scope', 'footerBtnService', 'globalIdService',
            function ($scope, footerBtnService, globalIdService) {

                $scope.idList = globalIdService.getIDs;

                $scope.rightButton = footerBtnService.getRight();
                $scope.middleButton = footerBtnService.getMiddle();
                $scope.leftButton = footerBtnService.getLeft();

                $scope.btnRight = function () {
                    $scope.rightButton.click();
                };

                $scope.btnLeft = function () {
                    if ($scope.leftButton.click === null) {
                        var nav = window.navigator;
                        if (this.phonegapNavigationEnabled &&
                            nav &&
                            nav.app &&
                            nav.app.backHistory) {
                            nav.app.backHistory();
                        } else {
                            window.history.back();
                        }
                    } else {
                        $scope.leftButton.click();
                    }
                };

                $scope.btnMiddle = function () {
                    $scope.middleButton.click();
                }
                
            }
    ]);