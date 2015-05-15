angular.module('mobilePhlebotomy')
    .controller("UserCtrl", [
        '$scope', 'webEclairService', '$routeParams', 'footerBtnService', 'cordovaReadyService', 'headerBtnService', '$timeout', 'sliderPageService',
        function ($scope, webEclairService, $routeParams, footerBtnService, cordovaReadyService, headerBtnService, $timeout, sliderPageService) {

            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            sliderPageService.setPageActive(1);
            sliderPageService.setReschedule(false);

            $scope.shouldShowEdit = false;
            $scope.editButtons = headerBtnService.getEditBtnClicks();
            var editListAllowed = function () {
                $scope.shouldShowEdit = !$scope.shouldShowEdit;
            }
            headerBtnService.setEditButton(true, editListAllowed);

            var rightButtonClick = function () {
                if ($scope.model.patientId) {
                    window.location = '#/patient/' + $scope.model.patientId;
                } else {
                    $scope.emptyInput = false;
                    $timeout(function () {
                        $scope.emptyInput = true;
                    }, 100);
                }
            };

            footerBtnService.setMainBtn('Next', true, rightButtonClick);

            var userModel = {
                barcode: $routeParams.usercode,
                pincode: $routeParams.pincode ? $routeParams.pincode : null
            }

            if (userModel.pincode) {
                webEclairService.userLogon(userModel, $scope);
            } else {
                webEclairService.getUserData($scope);
            }

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            $scope.patientId = result.text;
                            window.location = '#/patient/' + result.text;
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                ));
            }

        }
    ]);