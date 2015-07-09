angular.module('services')
    .factory('customTranslateLoader', ['$q', '$http', '$ionicPopup', function ($q, $http, $ionicPopup) {
        return function (options) {

            options.url = localStorage.getItem('apiUrl') ? localStorage.getItem('apiUrl') + "GetLabels" : "";

            var deferred = $q.defer(),
                requestParams = {};

            requestParams[options.queryParameter || 'lang'] = options.key;

            //alert(options.url);

            $http(angular.extend({
                url: options.url,
                params: requestParams,
                method: 'GET'
            }, options.$http)).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                //alert('failed');
                localStorage.removeItem('apiUrl');
                $ionicPopup.alert({
                    template: "<div class='item item-icon-left' style='border: 0; white-space: normal; background-color: transparent; padding: 8px 8px 8px 65px;'><i class='icon ion-alert-circled' style='color: #FCC810 ; font-size: 45px;'></i>No label data available</div>",
                    okType: 'button-footer'
                }).then(function() {
                    window.location = "#/manageDevice";
                });
                deferred.reject();
            });

            return deferred.promise;
        };
    }]);