angular.module('mobilePhlebotomy')
    .controller("HomeCtrl", [
        '$scope', 'cordovaReadyService', 'footerBtnService', '$ionicPopup', '$q', '$timeout', 'headerBtnService', 'sliderPageService', 'deviceStatusService',
        function ($scope, cordovaReadyService, footerBtnService, $ionicPopup, $q, $timeout, headerBtnService, sliderPageService, deviceStatusService) {

            // Shaking animation on the empty input field 
            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            // Progress bar indicator
            sliderPageService.setPageActive(0);
            sliderPageService.setReschedule(false);

            //headerBtnService.setEditButton(false, null);

            // Hides extra menu for mfb or popover icon
            deviceStatusService.setHasSubheaderStatus(false);

            var deferModal = $q.defer();

            // Maybe change the name to goButtonClick or doneButtonClick. Also includes shaking animation, timeout for ng-show and ng-hide
            $scope.rightButtonClick = function () {
                cordova.plugins.Keyboard.close();
                if ($scope.model.userId) {
                    $scope.openModal();
                    deferModal.promise.then(function (pinCode) {
                        window.location = '#/user/' + $scope.model.userId + '/pin/' + pinCode;
                    });
                } else {
                    $scope.emptyInput = false;
                    $timeout(function () {
                        $scope.emptyInput = true;
                    }, 100);
                }
            };

            //footerBtnService.setMainBtn('Next', true, $scope.rightButtonClick);

            // The scanning function
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