angular.module('myApp')
    .factory('notificationDlgService', ['cordovaReadyService', function (cordovaReadyService) {

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