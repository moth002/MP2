angular.module('mobilePhlebotomy')
    .controller("CollectCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup', '$ionicLoading', 'chkbxSpecimenService', 'headerBtnService',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup, $ionicLoading, chkbxSpecimenService, headerBtnService) {
            $scope.init = function () {
                var defer = $q.defer();

                $scope.shouldShowEdit = false;

                $ionicLoading.show();

                $scope.model = {
                    message: "Scan the collected and labelled samples",
                    chkboxSpecimens: [],
                    dateTime: undefined
                }

                defer.promise.then(function () {
                    $ionicLoading.hide();

                    for (var i = 0; i < $scope.order.Specimens.length; i++) {
                        $scope.model.chkboxSpecimens.push({ name: $scope.order.Specimens[i], code: $scope.order.Barcodes[i], checked: undefined });
                    }
                });

                $scope.idList = globalIdService.getIDs();

                var orderModel = {
                    orderId: $scope.idList.orderId,
                    patientId: $scope.idList.patientId
                }

                var patientModel = {
                    nhi: $scope.idList.patientId,
                    scheme: 'NHI'
                }

                $http.post(window.apiUrl + 'OrderMatching', orderModel)
                    .success(function (response) {
                        $scope.order = response;
                        globalIdService.setIDs($scope.idList.userId, $scope.idList.patientId, $scope.idList.orderId, $scope.idList.tokenId);
                        defer.resolve();
                    })
                    .error(function (err, status) {
                        if (status === 404)
                            alert("Order mismatch");
                        if (status === 401)
                            alert("Unauthorized User");
                        defer.resolve();
                        window.location = '#/';
                    });

                $http.post(window.apiUrl + 'PatientValidation', patientModel).success(function (response) {
                    $scope.patient = response;
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                });

                var rightButtonClick = function () {
                    var d = new Date();
                    $scope.model.dateTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
                    $ionicPopup.prompt({
                        title: 'Please confirm',
                        templateUrl: 'dateTime-Confirm.html',
                        scope: $scope,
                        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                            text: 'Cancel',
                            type: 'button-default',
                            onTap: function () {}
                        }, {
                            text: 'OK',
                            type: 'button-footer',
                            onTap: function () {
                                // Returning a value will cause the promise to resolve with the given value.
                                if ($scope.model.dateTime) {
                                    var needToReschedule = false;
                                    $scope.model.chkboxSpecimens.forEach(function (item) {
                                        if (item.checked === undefined) {
                                            needToReschedule = true;
                                        }
                                    });
                                    chkbxSpecimenService.setSpecimenList($scope.model.chkboxSpecimens);
                                    window.location = needToReschedule ? '#/schedule' : '#/complete/' + $scope.model.dateTime;
                                }    
                            }
                        }]
                    });
                };

                footerBtnService.setRight('Next', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Back', false, null);

                var editListAllowed = function () {
                    $scope.shouldShowEdit = !$scope.shouldShowEdit;
                }

                headerBtnService.setEditButton(true, editListAllowed);

            }

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled){
                            $scope.model.chkboxSpecimens.forEach(function(item) {
                                if (item.code === result.text) {
                                    item.checked = 'checked';
                                    $scope.$apply(); // refresh the $scope
                                }
                            });
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }
        }
    ]);