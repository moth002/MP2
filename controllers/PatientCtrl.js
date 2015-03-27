angular.module('myApp')
    .controller("PatientCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup) {
            $scope.init = function () {
                var defer = $q.defer();

                var rightButtonClick = function () { window.location = '#/order/1858' };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft(true);

                defer.promise.then(function () {
                    cordovaReadyService(window.plugins.spinnerDialog.hide());
                });

                var patientModel = {
                    nhi: $routeParams.barcode,
                    scheme: 'nhi'
                }

                $scope.idList = globalIdService.getIDs();

                $http.post(window.apiUrl + 'GetPatientData', patientModel)
                    .success(function (response) {
                        $scope.patient = response;
                        globalIdService.setIDs($scope.idList.userId, patientModel.nhi, '', $scope.idList.tokenId);
                        defer.resolve();
                    })
                    .error(function (err, status) {
                        defer.resolve();
                        if (status === 404)
                            alert("Pateint not found");
                        if (status === 401) {
                            $ionicPopup.alert({
                                template: "<img src='./images/Unauthorised-Error.png' style='max-width: 100%; max-height: 100%;' />",
                                okType: 'button-footer'
                            }).then(function () {
                                window.location = '#/';
                            });   
                        }
                    });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                });

                $scope.model = {
                    message: "Scan the order form or enter the order number"
                }
            }

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        $scope.userId = result.text;
                        window.location = '#/order/' + result.text;
                        window.plugins.spinnerDialog.show(null, "Getting Data", true);
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }
        }
    ]);