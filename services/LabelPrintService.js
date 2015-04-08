angular.module('myApp')
    .factory('labelPrintService', ['cordovaReadyService', 'globalIdService', '$ionicLoading', function (cordovaReadyService, globalIdService, $ionicLoading) {

        function success(result) {
            return true;
        }

        function failure(result) {
            return false;
        };

        var d = new Date();
        var dateAndTime = ""  + " " + d.toDateString();
        
        var labelPrinter = {

            connect: function() {
                var idList = globalIdService.getIDs();
                var printer = idList.printerId;

                $ionicLoading.show({
                    template: 'Connecting to printer',
                    duration: '1500'
                });

                cordovaReadyService(window.bluetoothSerial.connect(printer, success, failure));
            },

            printSpecimenLabel: function (msg1, msg2, msg3Array, barCodeArray) {
                var zplString = "^XA^FO10,22^BXN,6,200^FD$barcode$^FS^FT127,50^A0N,28,39^FD$msg$^FS^FT107,77^A0N,23,32^FD$msg2$^FS^FT107,100^A0N,23,32^FD$msg3$^FS^PQ1,0,1,Y^XZ";

                try
                {
                    setTimeout(function () {
                        $ionicLoading.show({
                            template: 'Printing....',
                            duration: '2000'
                        });
                        for (var i = 0; i < msg3Array.length; i++) {
                            var printString = zplString;
                            printString = printString.replace("$msg$", msg1);
                            printString = printString.replace("$msg2$", msg2);
                            printString = printString.replace("$msg3$", msg3Array[i].split(',', 1));
                            printString = printString.replace("$barcode$", barCodeArray[i]);
                            cordovaReadyService(window.bluetoothSerial.write(printString, success, failure));
                        }
                        labelPrinter.close();
                    }, 5000);
                }
                catch (e)
                {
                    //return false;
                }
            },

            close: function() {
                cordovaReadyService(window.bluetoothSerial.disconnect(success, failure));
            }
        };

        return labelPrinter;
    }]);