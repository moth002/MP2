angular.module('mobilePhlebotomy')
    .controller("CollectCtrl", [
        '$scope', 'webEclairService', 'footerBtnService', 'cordovaReadyService', '$ionicPopup', 'sliderPageService', 'chkbxSpecimenService', 'headerBtnService', 'labelPrintService',
        function ($scope, webEclairService, footerBtnService, cordovaReadyService, $ionicPopup, sliderPageService, chkbxSpecimenService, headerBtnService, labelPrintService) {

            $scope.model = {
                message: "Scan the collected and labelled samples",
                chkboxSpecimens: [],
                dateTime: undefined
            }

            sliderPageService.setPageActive(4);
            sliderPageService.setReschedule(false);

            $scope.shouldShowEdit = false;

            headerBtnService.setEditButton(false, null);

            headerBtnService.setSubHeaderVisible(true);


            var orderModel = {
                orderId: null,
                patientId: null
            }

            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            webEclairService.getUserData($scope);
            webEclairService.orderMatching(orderModel, $scope);
            webEclairService.patientValidation(patientModel, $scope);

            var rightButtonClick = function () {
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
                                $scope.model.chkboxSpecimens.forEach(function (item) {
                                    if (item.checked === undefined) {
                                        needToReschedule = true;
                                    }
                                });
                                chkbxSpecimenService.setSpecimenList($scope.model.chkboxSpecimens);
                                labelPrintService.printOrderReciept($scope.patient.NHI, $scope.patient.Name, $scope.patient.DOB, $scope.user.Name);
                                window.location = needToReschedule ? '#/schedule' : '#/complete/' + $scope.model.dateTime;
                            }
                        }
                    }]
                });
            };

            footerBtnService.setMainBtn('Next', true, rightButtonClick);


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
                        alert("Scanning failed: " + error);
                    }
                ));
            }
        }
    ]);