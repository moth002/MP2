angular.module('mobilePhlebotomy')
    .controller("DeviceStatusCtrl", ['$scope', 'deviceStatusService', 'webEclairService', '$ionicSideMenuDelegate', '$timeout',
        function ($scope, deviceStatusService, webEclairService, $ionicSideMenuDelegate, $timeout) {

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

            $scope.updateDNS = function () {
                webEclairService.getDeviceValidation($scope.dns);
                window.location = '#/';
            };

            $scope.btnUregisterDevice = function () {
                $ionicSideMenuDelegate.toggleLeft();
                webEclairService.getUnregisterDevice();
            };

            $scope.btnManageDevice = function () {
                localStorage.removeItem('apiUrl');
                $ionicSideMenuDelegate.toggleLeft();
                window.location = '#/manageDevice';
                
            };
        }
    ])