angular.module('myApp')
    .controller("SideMenuBtnCtrl", [
        '$scope', 'cordovaReadyService', '$ionicSideMenuDelegate', 'globalIdService',
            function ($scope, cordovaReadyService, $ionicSideMenuDelegate, globalIdService) {

                $scope.init = function () {

                    //////// ------------------------
                    //////// Think of placing a spinner untill the timer is done below
                    //////// ------------------------

                    $scope.getList = function (devices) {
                        if (devices.length !== 0) {
                            $scope.bluetooth = 'Printers';

                            $scope.printerOptions = [];

                            devices.forEach(function (device) {
                                $scope.printerOptions.push({name: device.name, id: device.id});
                            });

                            $scope.printerOptions.sort();
                            $scope.selectedPrinter = $scope.printerOptions[0];
                            globalIdService.setPrinter($scope.printerOptions[0].id);

                        } else {
                            $scope.bluetooth = 'Please pair a printer';
                        }

                    };

                    $scope.failure = function (reason) {
                        alert('Unable to list printers: ' + reason);
                    }

                    setTimeout(function () { // oddly the timer is needed to ensure all services are available.
                        cordovaReadyService(window.bluetoothSerial.list($scope.getList, $scope.falure));
                    }, 2000);


                }

                $scope.ctlDeviceActive = {
                    value: true
                }

                $scope.deviceActiveChanged = function () {
                    // ------------------------------------------------------------------
                    // An alert to get the admin password
                    // A call to the WebServer to confirm the password
                    // and register or deregister a device.
                    // ------------------------------------------------------------------
                    alert("You have to be an admin");
                    $scope.ctlDeviceActive.value = true;
                }

                $scope.btnHome = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                    window.location = '#/';
                };

                $scope.btnBluetooth = function () {
                };

            }
    ]);