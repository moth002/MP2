angular.module('services')
    .factory('footerBtnService', function () {
        var mainButton = {
            title: 'Next', isVisible: false, click: null
        };

        return {
            getMainBtn: function() {
                return mainButton;
            },
            setMainBtn: function(t, v, c) {
                mainButton.title = t;
                mainButton.isVisible = v;
                mainButton.click = c;
            }
            //getMiddle: function() {
            //    return middleButton;
            //},
            //setMiddle: function(t, v, c) {
            //    middleButton.title = t;
            //    middleButton.isVisible = v && globalIdService.isPrinterPaired() ? true : false ;
            //    middleButton.click = c;
            //},
            //getLeft: function () {
            //    return leftButton;
            //},
            //setLeft: function (t, v, c) {
            //    leftButton.title = t;
            //    leftButton.isVisible = v;
            //    leftButton.click = c;
            //}
        }
    });