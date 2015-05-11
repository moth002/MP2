angular.module('services')
    .factory('subHeaderService', function () {
        var subHeader = {
            isVisible : false
        };
        var btn = {
            text: '',
            click: null
        };

        return {
            getSubHeader: function () {
                return subHeader;
            },
            setVisible: function (v) {
                subHeader.isVisible = v;
                if (v) {
                    document.getElementById("content").classList.add("has-subheader");
                } else {
                    document.getElementById("content").classList.remove("has-subheader");
                }
            }
        }
});