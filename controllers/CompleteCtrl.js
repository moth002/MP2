angular.module('myApp')
    .controller("CompleteCtrl", [
        '$scope', '$http', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'globalIdService', '$q', '$ionicPopup',
        function ($scope, $http, $routeParams, footerBtnService, cordovaReadyService, globalIdService, $q, $ionicPopup) {
            $scope.init = function () {
                $scope.idList = globalIdService.getIDs();

                var patientModel = {
                    nhi: $scope.idList.patientId,
                    scheme: 'NHI'
                }

                $http.post(window.apiUrl + 'GetPatientData', patientModel).success(function (response) {
                    $scope.patient = response;
                });

                $http.get(window.apiUrl + 'GetUserData', { params: {id: $scope.idList.userId} }).success(function(result) {
                    $scope.user = result;
                });

                footerBtnService.setRight('Next', false, null);
                footerBtnService.setMiddle('', false, null);
                footerBtnService.setLeft(true);

            }
        }
    ]);