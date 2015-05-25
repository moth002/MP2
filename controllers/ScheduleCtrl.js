angular.module('mobilePhlebotomy')
    .controller("ScheduleCtrl", [
        '$scope', 'webEclairService', 'footerBtnService', '$ionicPopup', 'chkbxSpecimenService', 'sliderPageService', 'globalIdService',
        function ($scope, webEclairService, footerBtnService, $ionicPopup, chkbxSpecimenService, sliderPageService, globalIdService) {
            $scope.init = function() {
                $scope.model = {
                    chkboxSpecimens: chkbxSpecimenService.getSpecimenList(),
                    dateTime: undefined
                }

                $scope.idList = globalIdService.getIDs();

                sliderPageService.setPageActive(4);
                sliderPageService.setReschedule(true);

                var patientModel = {
                    nhi: null,
                    scheme: 'NHI'
                }

                //var orderModel = {
                //    orderId: null,
                //    patientId: null
                //}

                webEclairService.getUserData($scope);
                webEclairService.patientValidation(patientModel, $scope);
                //webEclairService.orderMatching(orderModel, $scope);

                var rightButtonClick = function () {
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

                footerBtnService.setMainBtn('Reschedule', true, rightButtonClick);
            }
        }
    ]);