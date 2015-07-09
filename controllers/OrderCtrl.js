 angular.module('mobilePhlebotomy')
    .controller("OrderCtrl", [
        '$scope', 'webEclairService', '$routeParams', '$ionicLoading', 'labelPrintService', 'headerBtnService', 'sliderPageService', 'deviceStatusService', '$timeout',
        function ($scope, webEclairService, $routeParams, $ionicLoading, labelPrintService, headerBtnService, sliderPageService, deviceStatusService, $timeout) {

            var stopLoadingSpinner = function () {
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            };

            //$scope.emptyInput = true;
            //$scope.isEmptyInput = function () {
            //    return $scope.emptyInput;
            //};

            // Progress bar indicator
            sliderPageService.setPageActive(3);
            sliderPageService.setReschedule(false);

            // Possibly no longer needed to show an edit icon in the header bar
                //$scope.shouldShowEdit = false;
                //$scope.editButtons = headerBtnService.getEditBtnClicks(); // no edits here
                //var editListAllowed = function () {
                //    $scope.shouldShowEdit = !$scope.shouldShowEdit;
                //}
                //headerBtnService.setEditButton(true, editListAllowed);

            // Maybe change the name to goButtonClick or doneButtonClick. Also includes shaking animation, timeout for ng-show and ng-hide
            $scope.rightButtonClick = function () {
                window.location = '#/collect';
            };

            $scope.printLabels = function () {
                /////// ------------------------
                /// This is not correct (if there is a problem with printing) the error will be reported n number of times
                /// need to pass the information then check if the connection is possible, only then print the n number of lables. 
                /////// ------------------------
                //labelPrintService.connect();
                //for (var i = 0; i < $scope.order.Specimens.length; i++) {
                labelPrintService.printSpecimenLabel(
                    $scope.patient.Name + " "
                    + $scope.patient.NHI, $scope.patient.Gender + " "
                    + $scope.patient.DOB, $scope.order.Specimens,
                    //+ $scope.patient.DOB, $scope.order.Specimens[i].split(',', 1),
                    $scope.order.Barcodes);
                //$scope.order.Barcodes[i]);
                //}
                //labelPrintService.close();
            };

            var orderModel = {
                orderId: $routeParams.orderId,
                patientId: null,
                previousActivable: ''
            }
            
            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }

            //$ionicLoading.show();
            webEclairService.orderMatching(orderModel)
                .then(function (response) {
                    $scope.order = response;
                    orderModel.previousActivable = $scope.order.PreviousActivable; // stores original activable value
                    var cancelOrderCollectClick = function () { // defines button click method
                        webEclairService.cancelOrderCollect(orderModel);
                    }
                    headerBtnService.setCancelCollectBtn(cancelOrderCollectClick);

                    // Displays extra menu for mfb or popover icon
                    deviceStatusService.setHasSubheaderStatus(true);
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

            // No longer required
                //footerBtnService.setMainBtn('Collect', true, $scope.rightButtonClick);

        }
    ]);