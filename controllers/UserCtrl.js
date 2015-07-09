angular.module('mobilePhlebotomy')
    .controller("UserCtrl", [
        '$scope', 'webEclairService', '$routeParams', '$ionicLoading', 'cordovaReadyService', 'headerBtnService', '$timeout', 'sliderPageService',
        function ($scope, webEclairService, $routeParams, $ionicLoading, cordovaReadyService, headerBtnService, $timeout, sliderPageService) {

            var stopLoadingSpinner = function() {
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
            sliderPageService.setPageActive(1);
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
                if ($scope.model.patientId) {
                    window.location = '#/patient/' + $scope.model.patientId;
                } else {
                    $scope.emptyInput = false;
                    $timeout(function () {
                        $scope.emptyInput = true;
                    }, 100);
                }
            };

            // No longer required
                //footerBtnService.setMainBtn('Next', true, $scope.rightButtonClick);

            var userModel = {
                barcode: $routeParams.usercode,
                pincode: $routeParams.pincode ? $routeParams.pincode : null
            }

            // This is to avoid asking a logged in user to re-enter their passcode or pincode
            //$ionicLoading.show();
            if (userModel.pincode) {
                webEclairService.userLogon(userModel)
                    .then(function (response) {
                        $scope.user = response;
                        stopLoadingSpinner(); 
                    });
            } else {
                webEclairService.getUserData()
               .then(function (response) {
                   $scope.user = response;
                   stopLoadingSpinner(); 
               });
            }

            // The scanning function
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