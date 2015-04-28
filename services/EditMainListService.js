angular.module('mobilePhlebotomy')
    .factory('editMainListService', function () {
        var editMainList = {
            editAllowed: false,

            getEditAllowed: function () {
                return editMainList.editAllowed;
            },
            setEditAllowed: function () {
                editMainList.editAllowed = !editMainList.editAllowed;
            }
        };

        return editMainList;
});