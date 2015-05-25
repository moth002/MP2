angular.module('services')
    .service('webEclairService', ['$http', '$q', 'globalIdService', '$ionicPopup', '$ionicLoading', '$timeout',
        function ($http, $q, globalIdService, $ionicPopup, $ionicLoading, $timeout) {
            var defer = $q.defer();
            var idList = globalIdService.getIDs();
            
            //----------------------------------------
            // needs to validate with token as well, to be used with next patient
            //----------------------------------------
            this.getUserData = function ($scope) {

                $http({
                    'method': 'get',
                    'url': window.apiUrl + 'GetUserData',
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
                    }, 1000);
                });

                $http({
                    'method': 'post',
                    'url': window.apiUrl + 'UserLogon',
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
                    }, 1000);
                });

                patientModel.nhi = patientModel.nhi ? patientModel.nhi : idList.patientId;

                $http({
                    'method': 'post',
                    'url': window.apiUrl + 'PatientValidation',
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
                    }, 1000);
                });

                orderModel.patientId = idList.patientId;
                orderModel.orderId = orderModel.orderId ? orderModel.orderId : idList.orderId;

                $http({
                    'method': 'post',
                    'url': window.apiUrl + 'OrderMatching',
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
