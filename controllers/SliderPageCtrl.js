angular.module('mobilePhlebotomy')
    .controller("SliderPageCtrl", ['$scope', 'sliderPageService',
        function ($scope, sliderPageService) {

            $scope.pages = sliderPageService.getPages();

        }
    ]);