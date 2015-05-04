angular.module('mobilePhlebotomy')
    .controller("CompleteCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicLoading', 'subHeaderService',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicLoading, subHeaderService) {
            $scope.init = function () {

                $ionicLoading.show();

                var d = new Date($routeParams.dateTime);
                $scope.dateTime = d.toDateString();

                $scope.idList = globalIdService.getIDs();
                var defer = $q.defer();

                defer.promise.then(function () {
                    $ionicLoading.hide();
                });

                var patientModel = {
                    nhi: $scope.idList.patientId,
                    scheme: 'NHI'
                }

                $http.post(window.apiUrl + 'PatientValidation', patientModel).success(function (response) {
                    $scope.patient = response;
                    defer.resolve();
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                    defer.resolve();
                });

                var rightButtonClick = function () {
                    window.location = '#/user/' + $scope.idList.userId + '/pin/4321';
                };

                footerBtnService.setRight('Next Patient', true, rightButtonClick);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft('Back', false, null);

                subHeaderService.setVisible(false);

            }
        }
    ]);