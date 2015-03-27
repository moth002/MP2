angular.module('myApp')
    .controller("OrderCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', 'labelPrintService', '$ionicPopup',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, labelPrintService, $ionicPopup) {
            $scope.init = function () {
                var defer = $q.defer();

                defer.promise.then(function () {
                    cordovaReadyService(window.plugins.spinnerDialog.hide());
                });

                $scope.idList = globalIdService.getIDs();

                var orderModel = {
                    orderId: $routeParams.orderId,
                    patientId: $scope.idList.patientId
                }

                var patientModel = {
                    nhi: $scope.idList.patientId,
                    scheme: 'NHI'
                }

                $http.post(window.apiUrl + 'GetOrderData', orderModel)
                    .success(function (response) {
                        $scope.order = response;
                        globalIdService.setIDs($scope.idList.userId, $scope.idList.patientId, orderModel.orderId, $scope.idList.tokenId);
                        defer.resolve();
                    })
                    .error(function (err, status) {
                        defer.resolve();
                        if (status === 404)
                            $ionicPopup.alert({
                                template: "<img src='./images/Mismatch-Error.png' style='max-width: 100%; max-height: 100%;' />",
                                okType: 'button-footer'
                            }).then(function () {
                                window.location = '#/patient/' + $scope.idList.patientId;
                            });
                        if (status === 401) {
                            alert("Unauthorized User");
                            
                            window.location = '#/';
                        }
                    });

                $http.post(window.apiUrl + 'GetPatientData', patientModel).success(function (response) {
                    $scope.patient = response;
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                });

                var setMiddleClick = function() {
                /////// ------------------------
                /// This is not correct (if there is a problem with printing) the error will be reported n number of times
                /// need to pass the information then check if the connection is possible, only then print the n number of lables. 
                /////// ------------------------
                    for (var i = 0; i < $scope.order.Specimens.length; i++) {
                        labelPrintService.print($scope.patient.Name + " "
                        + $scope.patient.NHI, $scope.patient.Gender + " "
                        + $scope.patient.DOB + "  "
                        + $scope.order.Specimens[i].split(',', 1),
                        $scope.order.Barcodes[i]);
                    }              
                };

                var rightButtonClick = function () { window.location = '#/collect' };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('Print Labels', true, setMiddleClick);
                footerBtnService.setLeft(true);
            }
        }
    ]);