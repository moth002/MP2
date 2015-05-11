angular.module('services')
    .factory('footerBtnService', ['globalIdService', function (globalIdService) {
        var rightButton = {
            title: 'Next',
            isVisible: false,
            click: null
        };
        var middleButton = {
            title: 'Next',
            isVisible: false,
            click: null
        };
        var leftButton = {
            title: 'Next',
            isVisible: false,
            click: null
        };

        return {
            getRight: function() {
                return rightButton;
            },
            setRight: function(t, v, c) {
                rightButton.title = t;
                rightButton.isVisible = v;
                rightButton.click = c;
            },
            getMiddle: function() {
                return middleButton;
            },
            setMiddle: function(t, v, c) {
                middleButton.title = t;
                middleButton.isVisible = v && globalIdService.isPrinterPaired() ? true : false ;
                middleButton.click = c;
            },
            getLeft: function () {
                return leftButton;
            },
            setLeft: function (t, v, c) {
                leftButton.title = t;
                leftButton.isVisible = v;
                leftButton.click = c;
            }
        }
    }]);