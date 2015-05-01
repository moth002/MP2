angular.module('mobilePhlebotomy')
    .controller("PatientCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading', 'headerBtnService', '$timeout',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading, headerBtnService, $timeout) {

            $scope.emptyInput = true;

            $scope.init = function () {
                var defer = $q.defer();

                $scope.shouldShowEdit = false;

                $ionicLoading.show();

                $scope.idList = globalIdService.getIDs;

                var rightButtonClick = function() {
                    if ($scope.idList.orderId) {
                        window.location = '#/order/' + $scope.idList.orderId;
                    } else {
                        $scope.emptyInput = false;
                        $timeout(function () {
                            $scope.emptyInput = true;
                        }, 100);
                    }
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Back', false, null);

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

            $scope.editListButton = function () {
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