angular.module('mobilePhlebotomy')
    .controller("ScheduleCtrl", [
        '$scope', 'webEclairService', 'footerBtnService', '$ionicPopup', 'chkbxSpecimenService', 'sliderPageService',
        function ($scope, webEclairService, footerBtnService, $ionicPopup, chkbxSpecimenService, sliderPageService) {
            $scope.init = function () {

                $scope.model = {
                    chkboxSpecimens: chkbxSpecimenService.getSpecimenList(),
                    dateTime: undefined
                }

                sliderPageService.setPageActive(4);
                sliderPageService.setReschedule(true);                

                // -----------------------------------------------------------------------------
                // this should be replaced with a service to send the LIS message and pront the reciept
                // -----------------------------------------------------------------------------
                //defer.promise.then(function () {
                //    $ionicLoading.hide();
                //    $ionicLoading.show({
                //        template: 'HL7 message sent to LIS',
                //        duration: '1500'
                //    });
                //});

                var patientModel = {
                    nhi: null,
                    scheme: 'NHI'
                }

                webEclairService.getUserData($scope);
                webEclairService.patientValidation(patientModel, $scope);

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