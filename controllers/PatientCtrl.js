angular.module('mobilePhlebotomy')
    .controller("PatientCtrl", [
        '$scope', 'webEclairService', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'headerBtnService', '$timeout', 'sliderPageService',
        function ($scope, webEclairService, $routeParams, footerBtnService, cordovaReadyService, headerBtnService, $timeout, sliderPageService) {

            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            sliderPageService.setPageActive(2);
            sliderPageService.setReschedule(false);

            $scope.shouldShowEdit = false;
            $scope.editButtons = headerBtnService.getEditBtnClicks();
            var editListAllowed = function () {
                $scope.shouldShowEdit = !$scope.shouldShowEdit;
            }
            headerBtnService.setEditButton(true, editListAllowed);

            var rightButtonClick = function () {
                if ($scope.model.orderId) {
                    window.location = '#/order/' + $scope.model.orderId;
                } else {
                    $scope.emptyInput = false;
                    $timeout(function () {
                        $scope.emptyInput = true;
                    }, 100);
                }
            };

            footerBtnService.setMainBtn('Next', true, rightButtonClick);
            
            var patientModel = {
                nhi: $routeParams.barcode,
                scheme: 'NHI' //'NHIHITEKCARE'
            }

            webEclairService.patientValidation(patientModel, $scope);
            webEclairService.getUserData($scope);

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