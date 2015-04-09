angular.module('myApp')
    .controller("HomeCtrl", [
        '$scope', '$http', 'cordovaReadyService', 'footerBtnService', 'globalIdService', '$ionicPopup', '$q',
        function ($scope, $http, cordovaReadyService, footerBtnService, globalIdService, $ionicPopup, $q ) {

            var defer = $q.defer();

            $scope.init = function () {
                var rightButtonClick = function() {
                    window.location = '#/user/MO/pin/4321';
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft(false);
            }

            $scope.passDots = '*';

            $scope.model = {
                message: "Scan or enter your ID"
            }

            $scope.idList = globalIdService.getIDs;

            $scope.initModal = function () {
                $scope.passcode = "";
                //$scope.passcodeModal._deregisterBackButton();
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
                defer.resolve($scope.passcode);
            };

            $scope.goHome = function () {
                $scope.passcodeModal.close();
                $scope.passcode = "";
                window.location = "#/";
            };

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled){
                            $scope.openModal();
                            defer.promise.then(function (pinCode) {
                                window.location = '#/user/' + result.text + '/pin/' + pinCode; 
                            });
                        }
                    },
                    function(error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }

        }
    ]);