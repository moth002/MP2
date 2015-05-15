angular.module('services')
    .factory('subHeaderService', function () {
        var subHeader = {
            isVisible : false
        };

        return {
            getSubHeader: function () {
                return subHeader;
            },
            setSubHeaderVisible: function (v) {
                subHeader.isVisible = v;
                //if (v) {
                //    document.getElementById("content").classList.add("has-subheader");
                //} else {
                //    document.getElementById("content").classList.remove("has-subheader");
                //}
            }
        }
});