angular.module('mobilePhlebotomy')
    .controller("DeviceStatusCtrl", ['$scope', 'deviceStatusService', 'webEclairService', '$ionicSideMenuDelegate', '$ionicPopover',
        function ($scope, deviceStatusService, webEclairService, $ionicSideMenuDelegate, $ionicPopover) {

            $scope.device = deviceStatusService.resetDeviceStatus();

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
                // see if you can add a .then to wait for the new dns to be set
                if ($scope.manageDeviceForm.$valid) {
                    webEclairService.getDeviceValidation($scope.dns)
                        .then(function() {
                            window.location = '#/home';
                        }, function() {
                            window.location = '#/manageDevice';
                        });
                }
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

            // .fromTemplateUrl() method
            $ionicPopover.fromTemplateUrl('my-popover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

            $scope.openPopover = function ($event) {
                $scope.popover.show($event);
            };
            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function () {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function () {
                // Execute action
            });
        }
    ])