angular.module('services')
    .service('scanBarcodeService', ['cordovaReadyService', 'globalIdService', '$ionicPopup',
        function (cordovaReadyService, globalIdService, $ionicPopup) {
            this.scan = function(res) {
                cordovaReadyService(window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            res = result.text;
                            window.location = '#/order/' + result.text;
                        }
                    },
                    function (error) {
                        $ionicPopup.alert({
                            template: "Scanning failed: " + error,
                            okType: 'button-footer'
                        }).then(function () {
                            window.location = '#/';
                        });
                    }
                ));
            };
        }]);
