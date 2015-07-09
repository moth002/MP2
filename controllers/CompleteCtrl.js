angular.module('mobilePhlebotomy')
    .controller("CompleteCtrl", [
        '$scope', '$routeParams', 'webEclairService', 'footerBtnService', 'deviceStatusService', 'sliderPageService', '$ionicLoading', '$timeout',
        function ($scope, $routeParams, webEclairService, footerBtnService, deviceStatusService, sliderPageService, $ionicLoading, $timeout) {

            var stopLoadingSpinner = function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            };

            // Progress bar indicator
            sliderPageService.setPageActive(6);
            sliderPageService.setReschedule(false);

            var d = new Date($routeParams.dateTime);
            $scope.dateTime = d.toDateString();

            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            $ionicLoading.show();
            webEclairService.patientValidation(patientModel)
                .then(function (response) {
                    $scope.patient = response;
                });
            webEclairService.getUserData()
                .then(function (response) {
                    $scope.user = response;
                    stopLoadingSpinner(); 
                });

            $scope.rightButtonClick = function () {
                window.location = '#/user//pin/';
            };

            // No longer required ???
                //footerBtnService.setMainBtn('Next Patient', true, rightButtonClick);

            // Removes display of extra menu for mfb or popover icon
            deviceStatusService.setHasSubheaderStatus(false);
        }
    ]);