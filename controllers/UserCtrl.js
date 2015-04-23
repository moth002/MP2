﻿angular.module('mobilePhlebotomy')
    .controller("UserCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading) {
            $scope.init = function () {
                var defer = $q.defer();

                $ionicLoading.show();

                var rightButtonClick = function () {
                    if ($scope.idList.patientId) {
                        window.location = '#/patient/' + $scope.idList.patientId;
                    }
                };

                var leftButtonClick = function() {
                    $ionicPopup.confirm({
                        title: 'Log off',
                        template: 'Are you sure you want to Log Off?'
                    }).then(function (res) {
                        if (res) {
                            window.location = '#/';
                        }
                    });
                }

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Log Off', true, leftButtonClick);

                defer.promise.then(function () {
                    $ionicLoading.hide();
                });

                var userModel = {
                    barcode: $routeParams.usercode,
                    pincode: $routeParams.pincode
                }

                $http.post(window.apiUrl + 'UserLogon', userModel)
                    .success(function(response) {
                        $scope.user = response;
                        globalIdService.setIDs(userModel.barcode, '', '', response.Token);
                        defer.resolve();
                    })
                    .error(function (err, status) {
                        defer.resolve();
                        if (status === 404){
                            $ionicPopup.alert({
                                //title: "<p style='color: steelBlue'>Warning</p>",
                                templateUrl: 'usercodeAndPin-Warning.html',
                                okType: 'button-footer'
                            }).then(function () {
                                window.location = '#/';
                            });
                        } else {
                            $ionicPopup.alert({
                                template: err.Message,
                                okType: 'button-footer'
                            }).then(function () {
                                window.location = '#/';
                            });
                        }                   
                    });

                $scope.model = {
                    message: "Scan the patient's wristband or enter the NHI"
                }
            }

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled){
                            $scope.patientId = result.text;
                            window.location = '#/patient/' + result.text;
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }

        }
    ]);