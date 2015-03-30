angular.module('myApp')
    .controller("HomeCtrl", [
        '$scope', '$http', 'cordovaReadyService', 'footerBtnService', 'globalIdService', '$ionicPopup', '$q', '$ionicLoading',
        function ($scope, $http, cordovaReadyService, footerBtnService, globalIdService, $ionicPopup, $q, $ionicLoading) {

            var defer = $q.defer();

            $scope.init = function () {

                var rightButtonClick = function() {
                    window.location = '#/user/MO/pin/4321';
                    $ionicLoading.show();
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

            //$ionicModal.fromTemplateUrl('Pincode-modal.html', {
            //    scope: $scope,
            //    backdropClickToClose: false,
            //    hardwareBackButtonClose : false
            //}).then(function (modal) {
            //    $scope.modal = modal;
            //});

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
                                $ionicLoading.show();
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