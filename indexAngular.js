(function () {
    var services = angular.module('services', []);
}());

(function () {
    var controllers = angular.module('controllers', []);
}());

angular.module("mobilePhlebotomy", ['ionic', 'ngCordova', 'ngRoute', 'ngResource', 'ngAnimate', 'ng-mfb', 'services', 'controllers'])
    .run(['$ionicPlatform', 'globalIdService', '$injector', 'cordovaReadyService', '$rootScope', '$ionicScrollDelegate', 'webEclairService',
        function ($ionicPlatform, globalIdService, $injector, cordovaReadyService, $rootScope, $ionicScrollDelegate, webEclairService) {
            $ionicPlatform.ready(function () {
                cordovaReadyService(window.plugins.insomnia.keepAwake());

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordovaReadyService(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true));
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    cordovaReadyService(window.StatusBar.styleDefault());
                    cordovaReadyService(window.StatusBar.overlaysWebView(true));
                    cordovaReadyService(window.StatusBar.backgroundColorByName("white"));
                }
                //ionic.Platform.isFullScreen = true;
                //ionic.Platform.showStatusBar(false);

                webEclairService.getDeviceValidation();

            });

            $ionicPlatform.registerBackButtonAction(function (event) {
                if (false) {
                    navigator.app.exitApp();
                }
                else {
                    //navigator.app.backHistory();
                }
            }, 100);

            $ionicPlatform.on('resume', function() {
                //alert('We are here');
            });

            // Override the transform Request, $injector get the object
            $injector.get("$http").defaults.transformRequest = function (data, headersGetter) {
                var idList = globalIdService.getIDs();
                headersGetter()['Authorization'] = idList.tokenId;
                if (data) { // original or base transformRequest
                    return angular.toJson(data);
                }
                return angular.toJson(data);
            };

            $rootScope.$on('$routeChangeSuccess', function () {
                $ionicScrollDelegate.scrollTop();
                webEclairService.getDeviceValidation();
            });

    }])

    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "views/home.html",
            controller: "HomeCtrl"
        })
        .when("/manageDevice", {
            templateUrl: "views/manageDevice.html",
            controller: "DeviceStatusCtrl"
        })
        .when("/register", {
            templateUrl: "views/register.html",
            controller: "DeviceStatusCtrl"
        })
        .when("/user/:usercode/pin/:pincode?", {
            templateUrl: "views/user.html",
            controller: "UserCtrl"
        })
        .when("/patient/:barcode", {
            templateUrl: "views/patient.html",
            controller: "PatientCtrl"
        })
        .when("/order/:orderId", {
            templateUrl: "views/order.html",
            controller: "OrderCtrl"
        })
        .when("/collect", {
            templateUrl: "views/collect.html",
            controller: "CollectCtrl"
        })
        .when("/complete/:dateTime", {
            templateUrl: "views/complete.html",
            controller: "CompleteCtrl"
        })
        .when("/schedule", {
            templateUrl: "views/schedule.html",
            controller: "ScheduleCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
    }])

    .constant('$ionicLoadingConfig', {
        template: '<div class="item-icon"><ion-spinner icon="bubbles"/></div>'
    })


