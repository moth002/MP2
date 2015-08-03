angular.module('services')
    .factory('chkbxSpecimenService', function () {
        var a = {
            specimenList: [],
    
            setSpecimenList: function (original) {
                a.specimenList = [];
                original.forEach(function(item) {
                    if (item.checked !== true) {
                        a.specimenList.push({ name: item.name, code: item.code, checked: true });
                    }
                });
            },
            getSpecimenList: function () {
                return a.specimenList;
            }

        };

        return a;
});