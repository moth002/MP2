angular.module('myApp')
    .controller("CompleteCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicLoading',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicLoading) {
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

                $http.post(window.apiUrl + 'GetPatientData', patientModel).success(function (response) {
                    $scope.patient = response;
                    defer.resolve();
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                    defer.resolve();
                });

                footerBtnService.setRight('Next', false, null);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft(true);

            }
        }
    ]);