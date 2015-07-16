angular.module('mobilePhlebotomy')
    .controller("CollectCtrl", [
        '$scope', 'webEclairService', '$ionicLoading', 'cordovaReadyService', '$ionicPopup', 'sliderPageService', 'chkbxSpecimenService', 'headerBtnService', 'labelPrintService', 'deviceStatusService', '$timeout',
        function ($scope, webEclairService, $ionicLoading, cordovaReadyService, $ionicPopup, sliderPageService, chkbxSpecimenService, headerBtnService, labelPrintService, deviceStatusService, $timeout) {

            var stopLoadingSpinner = function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            };

            $scope.model = {
                message: "Scan the collected and labelled samples",
                //chkboxSpecimens: [],
                dateTime: undefined
            }

            // Progress bar indicator
            sliderPageService.setPageActive(4);
            sliderPageService.setReschedule(false);

            // No longer required
            //$scope.shouldShowEdit = false;

            // No longer required
            //headerBtnService.setEditButton(false, null);

            // Displays extra menu for mfb or popover icon
            deviceStatusService.setHasSubheaderStatus(true);

            var orderModel = {
                orderId: null,
                patientId: null,
                checkInprogress: false,
                checkDate: true
            }

            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            $ionicLoading.show();
            webEclairService.orderMatching(orderModel)
                .then(function (response) {
                    $scope.order = response;
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
                    templateUrl: 'dateTime-Confirm.html',
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
                            if ($scope.model.dateTime) {
                                var needToReschedule = false;
                                $scope.order.chkboxSpecimens.forEach(function (item) {
                                    if (item.checked === undefined) {
                                        needToReschedule = true;
                                    }
                                });
                                webEclairService.collectOrder($scope.order)
                                    .then(function() {
                                        chkbxSpecimenService.setSpecimenList($scope.order.chkboxSpecimens);
                                        labelPrintService.printOrderReciept($scope.patient.NHI, $scope.patient.Name, $scope.patient.DOB, $scope.user.Name);
                                        //$ionicLoading.show({
                                        //    template: 'HL7 message sent to LIS',
                                        //    duration: '1500'
                                        //});
                                        window.location = needToReschedule ? '#/schedule': '#/complete/' + $scope.model.dateTime;
                                    },
                                    function() {
                                        $ionicPopup.alert({
                                            template: "Sending HL7 message failed",
                                            okType: 'button-footer'
                                        });
                                    });
                            }
                        }
                    }]
                });
            };

            // No longer required
                //footerBtnService.setMainBtn('Complete', true, $scope.rightButtonClick);

            $scope.scanCode = function () {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled){
                            $scope.model.chkboxSpecimens.forEach(function(item) {
                                if (item.code === result.text) {
                                    item.checked = 'checked';
                                    $scope.$apply(); // refresh the $scope
                                }
                            });
                        }
                    },
                    function (error) {
                        $ionicPopup.alert({
                            template: "Scanning failed: " + error,
                            okType: 'button-footer'
                        });
                    }
                ));
            }
        }
    ]);