angular.module('services')
    .service('webEclairService', ['$http', '$q', 'globalIdService', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaDevice', 'deviceStatusService',
        function ($http, $q, globalIdService, $ionicPopup, $ionicLoading, $timeout, $cordovaDevice, deviceStatusService) {
            var defer = $q.defer();
            var idList = globalIdService.getIDs();
            var apiUrl = localStorage.getItem('apiUrl');

            this.getUnregisterDevice = function () {
                $http({
                    'method': 'get',
                    'url': apiUrl + 'GetUnregisterDevice',
                    'params': { id: $cordovaDevice.getUUID() }
                })
                .success(function (response) {
                    window.location = '#/register';
                })
                .error(function (err, status) {
                    $ionicPopup.alert({
                        template: err.code,
                        okType: 'button-footer'
                    }).then(function () {
                        //window.location = '#/';
                    });
                });
            };
            this.adminLogon = function(adminModel) {
                $ionicLoading.show();
                defer.promise.then(function () {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                });

                adminModel.deviceId = $cordovaDevice.getUUID();

                $http({
                    'method': 'post',
                    'url': apiUrl + 'AdminLogon',
                    'data': adminModel
                })
                .success(function () {
                    deviceStatusService.setRegistrationStatus(true);
                    defer.resolve();
                    window.location = '#/';
                })
                .error(function (err, status) {
                    defer.resolve();
                    if (status === 404) {
                        $ionicPopup.alert({
                            templateUrl: 'usercodeAndPin-Warning.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/register';
                        });
                    } else {
                        $ionicPopup.alert({
                            template: err.Message,
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/register';
                        });
                    }
                });
            };        
            this.getDeviceValidation = function (dns) {
                $ionicLoading.show();
                defer.promise.then(function () {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 500);
                });
                if (dns || localStorage.getItem('apiUrl')) {
                    apiUrl = dns ? "http://" + dns + "/Eclair/api/MobilePhlebotomy/" : apiUrl;
                    localStorage.setItem('apiUrl', apiUrl);
                } else {
                    apiUrl = '';
                };

                $http({
                    'method': 'get',
                    'url': apiUrl + 'GetDNSConnection'
                })
                .success(function () {
                    $http({
                            'method': 'get',
                            'url': apiUrl + 'getDeviceValidation',
                            'params': { id: $cordovaDevice.getUUID() }
                        })
                        .success(function() {
                            deviceStatusService.setRegistrationStatus(true);
                        })
                        .error(function() {
                            deviceStatusService.setRegistrationStatus(false);
                            window.location = '#/register';
                        });
                    defer.resolve();
                })
                .error(function () {
                    defer.resolve();
                    deviceStatusService.setRegistrationStatus(false);
                    window.location = '#/manageDevice';
                });             
            };

            //----------------------------------------
            // needs to validate with token as well, to be used with next patient
            //----------------------------------------
            this.getUserData = function ($scope) {

                $http({
                    'method': 'get',
                    'url': apiUrl + 'GetUserData',
                    'params': { id: idList.userId }
                })
                .success(function (response) {
                    $scope.user = response;
                })
                .error(function (err, status) {
                    //defer.resolve();
                    if (status === 401) {
                        $ionicPopup.alert({
                            templateUrl: 'unauthorised-error.html',
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
            };
            this.userLogon = function (userModel, $scope) {
                $ionicLoading.show();
                defer.promise.then(function () {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                });

                userModel.deviceId = $cordovaDevice.getUUID();

                $http({
                    'method': 'post',
                    'url': apiUrl + 'UserLogon',
                    'data': userModel
                })
                .success(function (response) {
                    $scope.user = response;
                    globalIdService.setIDs(userModel.barcode, '', '', response.Token);
                    defer.resolve();
                })
                .error(function (err, status) {
                    defer.resolve();
                    if (status === 404) {
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
            };
            this.patientValidation = function (patientModel, $scope) {
                $ionicLoading.show();

                defer.promise.then(function () {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                });

                patientModel.nhi = patientModel.nhi || idList.patientId;

                $http({
                    'method': 'post',
                    'url': apiUrl + 'PatientValidation',
                    'data': patientModel
                })
                .success(function (response) {
                    $scope.patient = response;
                    globalIdService.setIDs(idList.userId, patientModel.nhi, '', idList.tokenId);
                    defer.resolve();
                })
                .error(function(err, status) {
                    defer.resolve();
                    if (status === 404)
                        $ionicPopup.alert({
                            templateUrl: "noPatient-warning.html",
                            okType: 'button-footer'
                        }).then(function() {
                            window.location = '#/user/' + idList.userId + '/pin/';
                        });
                    if (status === 401) {
                        $ionicPopup.alert({
                            templateUrl: 'unauthorised-error.html',
                            okType: 'button-footer'
                        }).then(function() {
                            window.location = '#/';
                        });
                    }
                });
            };
            this.orderMatching = function (orderModel, $scope) {
                $ionicLoading.show();

                defer.promise.then(function () {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                });

                orderModel.patientId = idList.patientId;
                orderModel.orderId = orderModel.orderId || idList.orderId;

                $http({
                    'method': 'post',
                    'url': apiUrl + 'OrderMatching',
                    'data': orderModel
                })
                .success(function (response) {
                    $scope.order = response;
                    globalIdService.setIDs(idList.userId, idList.patientId, orderModel.orderId, idList.tokenId);
                    defer.resolve();
                    for (var i = 0; i < $scope.order.Specimens.length; i++) {
                        $scope.model.chkboxSpecimens.push({ name: $scope.order.Specimens[i], code: $scope.order.Barcodes[i], checked: undefined });
                    }
                })
                .error(function (err, status) {
                    defer.resolve();
                    if (status === 404)
                        $ionicPopup.alert({
                            templateUrl: "mismatched-error.html",
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/patient/' + idList.patientId;
                        });
                    if (status === 401) {
                        $ionicPopup.alert({
                            templateUrl: 'unauthorised-error.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/';
                        });
                    }
                });
            };
        }]);
