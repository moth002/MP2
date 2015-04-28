angular.module('mobilePhlebotomy')
    .factory('headerBtnService', function () {
        var editButton = {
            isVisible: false,
            click: null
        };

        return {
            getEditButton: function () {
                return editButton;
            },
            setEditButton: function (v, c) {
                editButton.isVisible = v;
                editButton.click = c;
            }
        }
});