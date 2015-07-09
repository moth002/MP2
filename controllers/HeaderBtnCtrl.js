angular.module('mobilePhlebotomy')
    .controller("HeaderBtnCtrl", [
        '$scope', '$ionicSideMenuDelegate', '$ionicPopup', 'headerBtnService', 'deviceStatusService',
            function ($scope, $ionicSideMenuDelegate, $ionicPopup, headerBtnService, deviceStatusService) {

                //$scope.device = deviceStatusService.getDeviceStatus();

                $scope.editButton = headerBtnService.getEditButton();
                $scope.cancelOrderCollectButton = headerBtnService.getCancelCollectBtn();

                //$scope.subHeader = headerBtnService.getSubHeader();

                $scope.btnSideMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.btnEditList = function () {
                    $scope.editButton.click();
                };

                $scope.btnGoHome = function () {
                    $ionicPopup.confirm({
                        title: 'Log off',
                        template: 'Are you sure you want to Log Off?',
                        okType: 'button-footer'
                    }).then(function (res) {
                        if (res) {
                            window.location = '#/home';
                        }
                    });
                };

                $scope.optOutOfOrder = function () {
                    $ionicPopup.confirm({
                        title: 'Cancel Order Collection',
                        template: 'Are you sure you want to cancel the collection of this order?',
                        okType: 'button-footer'
                    }).then(function (res) {
                        if (res) {
                            deviceStatusService.setHasSubheaderStatus(false);
                            $scope.cancelOrderCollectButton.click();
                        }
                    });
                }

                $scope.addComment = function() {
                    $scope.commentModal = $ionicPopup.show({
                        title: 'Add a comment',
                        templateUrl: 'comments-Page.html',
                        scope: $scope
                    });
                };

                $scope.closeModal = function() {
                    $scope.commentModal.close();
                };
            }
    ]);