﻿angular.module('myApp')
    .controller("MainCtrl", [
        '$scope', '$http', 'cordovaReadyService', 'footerBtnService', 'globalIdService', '$ionicModal', '$q', '$ionicLoading',
        function ($scope, $http, cordovaReadyService, footerBtnService, globalIdService, $ionicModal, $q, $ionicLoading) {

            var defer = $q.defer();

            $scope.init = function () {

                var rightButtonClick = function() {
                    window.location = '#/user/MO/pin/4321';
                    $ionicLoading.show({
                        noBackdrop: true
                    });
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

            $ionicModal.fromTemplateUrl('Pincode-modal.html', {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose : false
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function () {
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
                defer.resolve($scope.passcode);
            };

            $scope.goHome = function () {
                $scope.modal.hide();
                $scope.passcode = "";
                window.location = "#/";
            };

            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

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