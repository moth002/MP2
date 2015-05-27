angular.module('services')
    .factory('labelPrintService', ['cordovaReadyService', 'globalIdService', '$ionicLoading', '$ionicPopup', '$cordovaBluetoothSerial',
        function (cordovaReadyService, globalIdService, $ionicLoading, $ionicPopup, $cordovaBluetoothSerial) {

        function success(result) {
            return true;
        }

        function failure(result) {
            return false;
        };

        var d = new Date();
        var theTime = d.toTimeString().split(':', 2);
        var theDate = d.toDateString().split(' ', 4);
        var timeDate = theTime[0] + ':' + theTime[1] + ' ' + theDate[1] + ' ' + theDate[2] + ' ' + theDate[3];
        
        var labelPrinter = {

            //connect: function() {
            //    var idList = globalIdService.getIDs();
            //    var printer = idList.printerId;

            //    cordovaReadyService(
            //        $cordovaBluetoothSerial.connect(printer).then(
            //            function () {
            //                $ionicLoading.show({
            //                    template: 'Connecting to printer',
            //                    duration: '1500'
            //                });
            //            },
            //            function (err) {
            //                $ionicPopup.alert({
            //                    template: err,
            //                    okType: 'button-footer'
            //                });
            //            }
            //        )
            //    );
            //},

            printSpecimenLabel: function (msg1, msg2, msg3Array, barCodeArray) {
                var idList = globalIdService.getIDs();
                var printer = idList.printerId;
                var zplString = "^XA^FO20,32^BXN,4,200^FD$barcode$^FS^FT80,48^A0N,28,39^FD$msg$^FS^FT80,76^A0N,23,32^FD$msg2$^FS" +
                    "^FT157,101^A0A,20,15^FD$msg3$^FS^FT20,101^A0N,20,15^FD$timeDate$^FS^XZ";
                
                //var str = "^XA^DFR:FA.ZPL^FS^FO53,96^LL240^BY2^BCN,77,Y,N^FN1^FS^FT39,200^CI0^FT77,40^A0N,28,39^FD$msg$".replace("$msg$", msg1);
                //str += "^FS^FT29,67^A0N,23,32^FD$msg2$^FS^PQ1,0,1,Y^XZ\n".replace("$msg2$", msg2);
                //str += "^XA^XFR:FA.ZPL^FS^FN1^FD$barcode$^FS^XZ\n".replace("$barcode$", "MO");

                //var str = "^XA^DFR:FA.ZPL^FS^FO220,6^BY3^BCN,50,Y,N^FN1^FS^XZ^XA^XFR:FA.ZPL^FS^FN1^FDMO^FS^XZ";

                cordovaReadyService(
                    $cordovaBluetoothSerial.connect(printer).then(
                        function () {
                            $ionicLoading.show({
                                template: 'Connecting to printer',
                                duration: '1500'
                            });
                            $ionicLoading.show({
                                template: 'Printing....',
                                duration: '2000'
                            });

                            for (var i = 0; i < msg3Array.length; i++) {
                                var printString = zplString;
                                printString = printString.replace("$msg$", msg1);
                                printString = printString.replace("$msg2$", msg2);
                                printString = printString.replace("$msg3$", msg3Array[i]);
                                printString = printString.replace("$barcode$", barCodeArray[i]);
                                printString = printString.replace("$timeDate$", timeDate);
                                cordovaReadyService(window.bluetoothSerial.write(printString, success, failure));
                            }
                            labelPrinter.close();
                        },
                        function (err) {
                            $ionicPopup.alert({
                                templateUrl: 'prinitng-warning.html',
                                okType: 'button-footer'
                            });
                        }
                    )
                );
            },

            printOrderReciept: function (nhi, name, dob, userName) {
                var zplString = "^XA^FWB^FO35,75^A0,40,40^FD$NHI$^FS^BY2,3^FO85,65^B7B,3,3,,18,N^FD Sysmex NZ Ltd. ^FS^FO150,45^A0B,25,20^FD$NAME$^FS" +
                    "^FO180,45^A0B,25,20^FD$DOB$^FS^FO180,165^A0B,25,20^FD$NHI2$^FS^FO210,70^A0B,25,20^FD$DATETIME$^FS^FO240,75^A0B,25,20^FDPhleb: $USERNAME$^FS^XZ";

                zplString = zplString.replace("$NHI$", nhi);
                zplString = zplString.replace("$NHI2$", nhi);
                zplString = zplString.replace("$NAME$", name);
                zplString = zplString.replace("$DOB$", dob);
                zplString = zplString.replace("$DATETIME$", timeDate);
                zplString = zplString.replace("$USERNAME$", userName);

                var idList = globalIdService.getIDs();
                var printer = idList.printerId;

                cordovaReadyService(
                    $cordovaBluetoothSerial.connect(printer).then(
                        function () {
                            cordovaReadyService(
                                $cordovaBluetoothSerial.write(zplString).then(function () { }, function () { })
                            );
                            labelPrinter.close();
                        },
                        function (err) {
                            //$ionicPopup.alert({
                            //    templateUrl: 'prinitng-warning.html',
                            //    okType: 'button-footer'
                            //});
                        }
                    )
                );

            },

            close: function() {
                cordovaReadyService($cordovaBluetoothSerial.disconnect().then(function () { }, function () { }));
            }
        };

        return labelPrinter;
    }]);