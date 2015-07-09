angular.module('services')
    .factory('deviceStatusService', function () {
        var device = {
            isRegistered: false,
            hasSubheader: false,
            hasFooter: false
        };

        return {
            getDeviceStatus: function () {
                return device;
            },
            setRegistrationStatus: function (s) {
                device.isRegistered = s;
            },
            setHasSubheaderStatus: function (s) {
                device.hasSubheader = s;
            },
            setHasFooterStatus: function (s) {
                device.hasFooter = s;
            },
            resetDeviceStatus: function () {
                device.isRegistered = false; device.hasFooter = false; device.hasSubheader = false;
                return device;
            }
        }
});