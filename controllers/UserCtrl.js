﻿angular.module('mobilePhlebotomy')
    .controller("UserCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading', 'headerBtnService', '$timeout',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading, headerBtnService, $timeout) {

            $scope.emptyInput = true;

            $scope.init = function () {
                var defer = $q.defer();

                $scope.shouldShowEdit = false;

                $ionicLoading.show();

                $scope.idList = globalIdService.getIDs;

                var rightButtonClick = function () {
                    if ($scope.idList.patientId) {
                        window.location = '#/patient/' + $scope.idList.patientId;
                    } else {
                        $scope.emptyInput = false;
                        $timeout(function () {
                            $scope.emptyInput = true;
                        }, 100);
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
                footerBtnService.setLeft('Log Off', false, leftButtonClick);

                var editListAllowed = function() {
                    $scope.shouldShowEdit = !$scope.shouldShowEdit;
                }

                headerBtnService.setEditButton(true, editListAllowed);

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

            $scope.editListButton = function() {
                $ionicPopup.confirm({
                    title: 'Log off',
                    template: 'Are you sure you want to Log Off?'
                }).then(function (res) {
                    if (res) {
                        window.location = '#/';
                    }
                });
            };

            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };
        }
    ]);