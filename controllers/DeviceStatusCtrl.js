angular.module('mobilePhlebotomy')
    .controller("DeviceStatusCtrl", ['$scope', 'deviceStatusService', 'webEclairService',
        function ($scope, deviceStatusService, webEclairService) {

            $scope.device = deviceStatusService.getDeviceStatus();

            $scope.logonAdmin = function () {
                if ($scope.adminLogon.$invalid) {
                    $scope.adminLogon.$setSubmitted();
                } else {
                    var adminModel = {
                        barcode: $scope.userCode,
                        password: $scope.password
                    }
                    webEclairService.adminLogon(adminModel);
                }
            };
        }
    ])