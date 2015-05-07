angular.module('mobilePhlebotomy')
    .controller("HomeCtrl", [
        '$scope', '$http', 'cordovaReadyService', 'footerBtnService', 'globalIdService', '$ionicPopup', '$q', '$timeout', 'headerBtnService', 'subHeaderService', 'sliderPageService',
        function ($scope, $http, cordovaReadyService, footerBtnService, globalIdService, $ionicPopup, $q, $timeout, headerBtnService, subHeaderService, sliderPageService) {
            var deferModal = $q.defer();
            $scope.idList = globalIdService.getIDs;

            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            $scope.openModal();
                            deferModal.promise.then(function (pinCode) {
                                window.location = '#/user/' + result.text + '/pin/' + pinCode;
                            });
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }

            $scope.init = function () {
                globalIdService.setIDs('', '', '', '');

                sliderPageService.setPageActive(0);
                sliderPageService.setReschedule(false);

                var rightButtonClick = function () {
                    if ($scope.idList.userId) {
                        $scope.openModal();
                        deferModal.promise.then(function (pinCode) {
                            window.location = '#/user/' + $scope.idList.userId + '/pin/' + pinCode;
                        });
                    } else {
                        $scope.emptyInput = false;
                        $timeout(function () {
                            $scope.emptyInput = true;
                        }, 100);
                    }
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('', false, null);

                headerBtnService.setEditButton(false, null);

                subHeaderService.setVisible(false);
            }          

            $scope.initModal = function () {
                $scope.passcode = "";
            }
            $scope.add = function (value) {
                if ($scope.passcode.length < 4) {
                    $scope.passcode = $scope.passcode + value;
                    if ($scope.passcode.length === 4) {
                        $scope.closeModal();
                    }
                }
            }
            $scope.delete = function () {
                if ($scope.passcode.length > 0) {
                    $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
                }
            }
            $scope.openModal = function () {
                $scope.passcodeModal = $ionicPopup.show({
                    scope: $scope,
                    title: 'Enter your passcode',
                    templateUrl: 'Pincode-modal.html'
                });
            };
            $scope.closeModal = function () {
                $scope.passcodeModal.close();
                deferModal.resolve($scope.passcode);
            };
            $scope.goHome = function () {
                $scope.passcodeModal.close();
                $scope.passcode = "";
                window.location = "#/";
            };

        }
    ])