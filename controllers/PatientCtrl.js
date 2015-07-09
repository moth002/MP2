angular.module('mobilePhlebotomy')
    .controller("PatientCtrl", [
        '$scope', 'webEclairService', '$routeParams', '$ionicLoading', 'cordovaReadyService', 'headerBtnService', '$timeout', 'sliderPageService',
        function ($scope, webEclairService, $routeParams, $ionicLoading, cordovaReadyService, headerBtnService, $timeout, sliderPageService) {

            var stopLoadingSpinner = function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            };

            // Shaking animation on the empty input field 
            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            // Progress bar indicator
            sliderPageService.setPageActive(2);
            sliderPageService.setReschedule(false);

            // Possibly no longer needed to show an edit icon in the header bar
                //$scope.shouldShowEdit = false;
            $scope.editButtons = headerBtnService.getEditBtnClicks();
                //var editListAllowed = function () {
                //    $scope.shouldShowEdit = !$scope.shouldShowEdit;
                //}
                //headerBtnService.setEditButton(true, editListAllowed);

            // Maybe change the name to goButtonClick or doneButtonClick. Also includes shaking animation, timeout for ng-show and ng-hide
            $scope.rightButtonClick = function () {
                if ($scope.model.orderId) {
                    window.location = '#/order/' + $scope.model.orderId;
                } else {
                    $scope.emptyInput = false;
                    $timeout(function () {
                        $scope.emptyInput = true;
                    }, 100);
                }
            };

            // No longer required
            //footerBtnService.setMainBtn('Next', true, $scope.rightButtonClick);
            
            var patientModel = {
                nhi: $routeParams.barcode,
                scheme: 'NHI' //'NHIHITEKCARE'
            }

            //$ionicLoading.show();
            webEclairService.patientValidation(patientModel)
                .then(function (response) {
                    $scope.patient = response;
                });
            webEclairService.getUserData()
                .then(function (response) {
                    $scope.user = response;
                    stopLoadingSpinner(); 
                });

            // The scanning function
            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            $scope.orderId = result.text;
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