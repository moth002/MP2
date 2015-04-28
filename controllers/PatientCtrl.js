angular.module('mobilePhlebotomy')
    .controller("PatientCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading', 'headerBtnService',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading, headerBtnService) {
            $scope.init = function () {
                var defer = $q.defer();

                $scope.shouldShowEdit = false;

                $ionicLoading.show();

                var rightButtonClick = function() {
                    if ($scope.idList.orderId) {
                        window.location = '#/order/' + $scope.idList.orderId;
                    }
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Back', true, null);

                var editListAllowed = function () {
                    $scope.shouldShowEdit = !$scope.shouldShowEdit;
                }

                headerBtnService.setEditButton(true, editListAllowed);

                defer.promise.then(function () {
                    $ionicLoading.hide();
                });

                var patientModel = {
                    nhi: $routeParams.barcode,
                    scheme: 'nhi'
                }

                $scope.idList = globalIdService.getIDs();

                $http.post(window.apiUrl + 'PatientValidation', patientModel)
                    .success(function (response) {
                        $scope.patient = response;
                        globalIdService.setIDs($scope.idList.userId, patientModel.nhi, '', $scope.idList.tokenId);
                        defer.resolve();
                    })
                    .error(function (err, status) {
                        defer.resolve();
                        if (status === 404)
                            $ionicPopup.alert({
                                templateUrl: "noPatient-warning.html",
                                okType: 'button-footer'
                            }).then(function () {
                                window.location = '#/user/' + $scope.idList.userId + '/pin/4321';
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
                        if (!result.cancelled){
                            $scope.userId = result.text;
                            window.location = '#/order/' + result.text;
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }
        }
    ]);