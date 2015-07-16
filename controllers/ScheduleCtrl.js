angular.module('mobilePhlebotomy')
    .controller("ScheduleCtrl", [
        '$scope', 'webEclairService', '$ionicLoading', '$ionicPopup', 'chkbxSpecimenService', 'sliderPageService', '$timeout', 'deviceStatusService',
        function ($scope, webEclairService, $ionicLoading, $ionicPopup, chkbxSpecimenService, sliderPageService, $timeout, deviceStatusService) {
            
            var stopLoadingSpinner = function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
                $scope.$apply(); // refresh the $scope
            };

            $scope.model = {
                //chkboxSpecimens: chkbxSpecimenService.getSpecimenList(),
                dateTime: undefined
            }

            //$scope.idList = globalIdService.getIDs();

            // Progress bar indicator
            sliderPageService.setPageActive(4);
            sliderPageService.setReschedule(true);

            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            var orderModel = {
                orderId: null,
                patientId: null,
                checkInprogress: false,
                checkDate : false
            }

            $ionicLoading.show();
            webEclairService.orderMatching(orderModel)
                .then(function (response) {
                    $scope.order = response;
                    $scope.order.chkboxSpecimens = chkbxSpecimenService.getSpecimenList();
                });
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
                var d = new Date();
                $scope.model.dateTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
                $ionicPopup.prompt({
                    title: 'Please confirm',
                    templateUrl: 'reschedule-Confirm.html',
                    scope: $scope,
                    buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                        text: 'Cancel',
                        type: 'button-default',
                        onTap: function () { }
                    }, {
                        text: 'OK',
                        type: 'button-footer',
                        onTap: function () {
                            // Returning a value will cause the promise to resolve with the given value.
                            window.location = '#/complete/' + $scope.model.dateTime;
                        }
                    }]
                });
            };

            // Removes display of extra menu for mfb or popover icon
            deviceStatusService.setHasSubheaderStatus(false);
        }
    ]);