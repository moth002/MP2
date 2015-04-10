angular.module('myApp')
    .controller("ScheduleCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicLoading', '$ionicPopup', 'chkbxSpecimenService',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicLoading, $ionicPopup, chkbxSpecimenService) {
            $scope.init = function () {

                $ionicLoading.show();

                $scope.idList = globalIdService.getIDs();
                var defer = $q.defer();

                $scope.model = {
                    chkboxSpecimens: chkbxSpecimenService.getSpecimenList(),
                    dateTime: undefined
                }

                defer.promise.then(function () {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'HL7 message sent to LIS',
                        duration: '1500'
                    });
                });

                var patientModel = {
                    nhi: $scope.idList.patientId,
                    scheme: 'NHI'
                }

                $http.post(window.apiUrl + 'GetPatientData', patientModel).success(function (response) {
                    $scope.patient = response;
                    defer.resolve();
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                    defer.resolve();
                });

                var rightButtonClick = function () {
                    var d = new Date();
                    $scope.model.dateTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
                    $ionicPopup.prompt({
                        title: 'Please confirm',
                        templateUrl: 'reschedule-Confirm.html',
                        scope: $scope,
                        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                            text: 'Cancel',
                            type: 'button-default',
                            onTap: function () { }
                        }, {
                            text: 'OK',
                            type: 'button-footer',
                            onTap: function () {
                                // Returning a value will cause the promise to resolve with the given value.
                                window.location = '#/complete/' + $scope.model.dateTime;
                            }
                        }]
                    });
                };

                footerBtnService.setRight('Reschedule', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Back', true, null);

            }
        }
    ]);