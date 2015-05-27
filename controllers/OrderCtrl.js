 angular.module('mobilePhlebotomy')
    .controller("OrderCtrl", [
        '$scope', 'webEclairService', '$routeParams', 'footerBtnService', 'labelPrintService', 'headerBtnService', 'sliderPageService',
        function ($scope, webEclairService, $routeParams, footerBtnService, labelPrintService, headerBtnService, sliderPageService) {
            
            $scope.emptyInput = true;
            $scope.isEmptyInput = function () {
                return $scope.emptyInput;
            };

            sliderPageService.setPageActive(3);
            sliderPageService.setReschedule(false);

            $scope.shouldShowEdit = false;
            $scope.editButtons = headerBtnService.getEditBtnClicks();
            var editListAllowed = function () {
                $scope.shouldShowEdit = !$scope.shouldShowEdit;
            }
            headerBtnService.setEditButton(true, editListAllowed);

            var rightButtonClick = function () {
                window.location = '#/collect';
            };

            footerBtnService.setMainBtn('Collect', true, rightButtonClick);

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
                patientId: null
            }
            
            var patientModel = {
                nhi: null,
                scheme: 'NHI'
            }
            webEclairService.getUserData($scope);
            webEclairService.orderMatching(orderModel, $scope);
            webEclairService.patientValidation(patientModel, $scope);         

        }
    ]);