angular.module('mobilePhlebotomy')
    .factory('notificationDlgService', ['cordovaReadyService', function (cordovaReadyService) {

        //////---------------------------------------------------------------------
        // I have removed the phonegap plugin
        // this is possibly no longer needed but I will keep incase later on to create a service for the $ionicPopup
        //////---------------------------------------------------------------------

        function alertDismissed() {
            // do something
        }

        var notificationDlg = {

            alertDialog: function (message, title) {
                return cordovaReadyService(navigator.notification.alert(
                       message,         // message
                       alertDismissed,  // callback
                       title,           // title
                       'Done'           // buttonName
                   ));
            }
        };

        return notificationDlg;
    }]);