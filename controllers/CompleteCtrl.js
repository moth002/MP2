angular.module('mobilePhlebotomy')
    .controller("CompleteCtrl", [
        '$scope', '$routeParams', 'webEclairService', 'footerBtnService', 'headerBtnService', 'sliderPageService',
        function ($scope, $routeParams, webEclairService, footerBtnService, headerBtnService, sliderPageService) {

            sliderPageService.setPageActive(6);
            sliderPageService.setReschedule(false);

            var d = new Date($routeParams.dateTime);
            $scope.dateTime = d.toDateString();

            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            webEclairService.getUserData($scope);
            webEclairService.patientValidation(patientModel, $scope);

            var rightButtonClick = function () {
                window.location = '#/user/so' + '/pin/';
            };

            footerBtnService.setMainBtn('Next Patient', true, rightButtonClick);

            headerBtnService.setSubHeaderVisible(false);
        }
    ]);