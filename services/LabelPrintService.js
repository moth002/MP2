angular.module('myApp')
    .factory('labelPrintService', ['cordovaReadyService', 'globalIdService', '$ionicLoading', function (cordovaReadyService, globalIdService, $ionicLoading) {

        function connect() {
            // do something
        }
        function print() {
            // do something
        }
        function close() {
            // do something
        }

        function success(result) {
            //alert("Success to " + result);
        }

        function failure(result) {
            //alert("Fail to " + result);
        };

        var labelPrinter = {

            print: function (msg1, msg2, barCode) {

                var idList = globalIdService.getIDs();
                var printer = idList.printerId;

                $ionicLoading.show({
                    template: 'Connecting to printer',
                    duration: '1500'
                });

                cordovaReadyService(window.bluetoothSerial.connect(printer, success, failure));

                var str = "^XA^DFR:FA.ZPL^FS^FO53,96^LL240^BY2^BCN,77,Y,N^FN1^FS^FT39,200^CI0^FT77,40^A0N,28,39^FD$msg$".replace("$msg$", msg1);
                str += "^FS^FT29,67^A0N,23,32^FD$msg2$^FS^PQ1,0,1,Y^XZ\n".replace("$msg2$", msg2);
                str += "^XA^XFR:FA.ZPL^FS^FN1^FD$barcode$^FS^XZ\n".replace("$barcode$", barCode);

                try
                {
                    setTimeout(function () {
                        $ionicLoading.show({
                            template: 'Printing....',
                            duration: '2000'
                        });
                        cordovaReadyService(window.bluetoothSerial.write(str, success, failure));
                        cordovaReadyService(window.bluetoothSerial.disconnect(success, failure));
                        return true;
                    }, 5000);
                }
                catch (e)
                {
                    return false;
                }
                return cordovaReadyService(window.bluetoothSerial.disconnect(success, failure));
            }
        };

        return labelPrinter;
    }]);