
angular.module('services')
    .service('webEclairService', ['$http', '$q', 'globalIdService', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaDevice', 'deviceStatusService', '$translate',
        function ($http, $q, globalIdService, $ionicPopup, $ionicLoading, $timeout, $cordovaDevice, deviceStatusService, $translate) {
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
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                    window.location = '#/register';
                })
                .error(function (err, status) {
                    window.location = '#/manageDevice';
                });
            };
            this.adminLogon = function (adminModel) {
                var deffered = $q.defer();
                adminModel.deviceId = $cordovaDevice.getUUID();

                $http({
                    'method': 'post',
                    'url': apiUrl + 'AdminLogon',
                    'data': adminModel
                })
                .success(function () {
                    deviceStatusService.setRegistrationStatus(true);
                    deffered.resolve();
                    window.location = '#/home';
                })
                .error(function (err, status) {
                    deffered.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
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
                return deffered.promise;
            };
            this.getDeviceValidation = function (dns) {
                $ionicLoading.show();
                var deffered = $q.defer();

                if (dns || localStorage.getItem('apiUrl')) {
                    apiUrl = dns ? "http://" + dns + "/Eclair/api/MobilePhlebotomy/" : localStorage.getItem('apiUrl');
                    localStorage.setItem('apiUrl', apiUrl);
                } else { // take me to manage device if there is no dns entered or the ROM field does not exist
                    deffered.reject();
                    deviceStatusService.setRegistrationStatus(true);
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                    window.location = '#/manageDevice';
                    return deffered.promise;
                };

                $http({
                    'method': 'get',
                    'url': apiUrl + 'GetDNSConnection'
                }).then(function () {
                    $http({
                        'method': 'get',
                        'url': apiUrl + 'getDeviceValidation',
                        'params': { id: $cordovaDevice.getUUID() }
                    }).then(function () { // device is registered
                        deffered.resolve();
                        deviceStatusService.setRegistrationStatus(true); // the Sysmex infinit at the bototm
                    }, function () { // device is not registered
                        deffered.reject();
                        deviceStatusService.setRegistrationStatus(false);
                        window.location = '#/register';
                    })
                    .finally(function () {
                        $translate.use('ENZ');
                        $translate.refresh();
                    });
                }, function () { // wrong dns entered
                    deffered.reject();
                    localStorage.removeItem('apiUrl');

                    $ionicPopup.alert({
                        template: "<div class='item item-icon-left' style='border: 0; white-space: normal; background-color: transparent; padding: 8px 8px 8px 65px;'><i class='icon ion-alert-circled' style='color: #FCC810 ; font-size: 45px;'></i>The DNS you entered is not valid</div>",
                        okType: 'button-footer'
                    });

                }).finally(function() {
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                });

                return deffered.promise;
            };

            //----------------------------------------
            // needs to validate with token as well, to be used such that a logged in user will not be asked to re-enter their passcode
            //----------------------------------------
            this.getUserData = function () {

                var deffered = $q.defer();

                $http({
                    'method': 'get',
                    'url': apiUrl + 'GetUserData',
                    'params': { id: idList.userId }
                })
                .success(function (response) {
                    deffered.resolve(response);
                })
                .error(function (err, status) {
                    deffered.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                    if (status === 401) {
                        $ionicPopup.alert({
                            templateUrl: 'unauthorised-error.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/home';
                        });
                    } else {
                        $ionicPopup.alert({
                            template: err.Message,
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/home';
                        });
                    }
                });
                return deffered.promise;
            };
            this.userLogon = function (userModel) {

                var deferred = $q.defer();

                userModel.deviceId = $cordovaDevice.getUUID();

                $http({
                    'method': 'post',
                    'url': apiUrl + 'UserLogon',
                    'data': userModel
                })
                .success(function (response) {
                    globalIdService.setIDs(userModel.barcode, '', '', response.Token);
                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    deferred.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                    if (status === 404) {
                        $ionicPopup.alert({
                            templateUrl: 'usercodeAndPin-Warning.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/home';
                        });
                    } else {
                        $ionicPopup.alert({
                            template: err.Message,
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/home';
                        });
                    }
                });

                return deferred.promise;
            };
            this.patientValidation = function (patientModel) {

                var deffered = $q.defer();

                patientModel.nhi = patientModel.nhi || idList.patientId;

                $http({
                    'method': 'post',
                    'url': apiUrl + 'PatientValidation',
                    'data': patientModel
                })
                .success(function (response) {
                    globalIdService.setIDs(idList.userId, patientModel.nhi, '', idList.tokenId);
                    deffered.resolve(response);
                })
                .error(function (err, status) {
                    deffered.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                    if (status === 404)
                        $ionicPopup.alert({
                            templateUrl: "noPatient-warning.html",
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/user/' + idList.userId + '/pin/';
                        });
                    if (status === 401) {
                        $ionicPopup.alert({
                            templateUrl: 'unauthorised-error.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/home';
                        });
                    }
                });
                return deffered.promise;
            };
            this.orderMatching = function (orderModel) {

                var deferred = $q.defer();

                orderModel.patientId = idList.patientId;
                orderModel.orderId = orderModel.orderId || idList.orderId;

                $http({
                    'method': 'post',
                    'url': apiUrl + 'OrderMatch',
                    'data': orderModel
                })
                .success(function (response) {
                    response.chkboxSpecimens = [];
                    globalIdService.setIDs(idList.userId, idList.patientId, orderModel.orderId, idList.tokenId);
                    for (var i = 0; i < response.Specimens.length; i++) {
                        response.chkboxSpecimens.push({ name: response.Specimens[i], code: response.Barcodes[i], checked: undefined });
                    }
                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    deferred.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
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
                            window.location = '#/home';
                        });
                    }
                    if (status === 409) { // the order selected is inProgress and cannot be accessed
                        $ionicPopup.alert({
                            templateUrl: 'inprogress-conflict.html',
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/patient/' + idList.patientId;
                        });
                    }
                });

                return deferred.promise;
            };
            this.cancelOrderCollect = function (orderModel) {

                $http({
                    'method': 'post',
                    'url': apiUrl + 'CancelOrderCollect',
                    'data': orderModel
                })
                .success(function (response) {
                    globalIdService.setIDs(idList.userId, idList.patientId, '', idList.tokenId);
                    window.location = '#/patient/' + idList.patientId;
                })
                .error(function (err, status) {
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
                            window.location = '#/home';
                        });
                    }
                });
            };
            this.collectOrder = function (orderModel) {

                var deferred = $q.defer();

                $http({
                    'method': 'post',
                    'url': apiUrl + 'CollectOrder',
                    'data': orderModel
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    deferred.reject();
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                });

                return deferred.promise;
            };
        }]);
