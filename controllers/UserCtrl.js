angular.module('myApp')
    .controller("UserCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading) {
            $scope.init = function () {
                var defer = $q.defer();

                $ionicLoading.show();

                var rightButtonClick = function() {
                    window.location = '#/patient/I0I0018';
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft(true);

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

        }
    ]);