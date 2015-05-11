angular.module('services')
    .factory('chkbxSpecimenService', function () {
        var a = {
            specimenList: [],
    
            setSpecimenList: function (original) {
                a.specimenList = [];
                original.forEach(function(item) {
                    if (item.checked === undefined) {
                        a.specimenList.push({ name: item.name, code: item.code, checked: 'checked' });
                    }
                });
            },
            getSpecimenList: function () {
                return a.specimenList;
            }

        };

        return a;
});