angular.module('myApp')
    .factory('globalIdService', function () {
        var idList = {
            userId: '',
            patientId: '',
            orderId: '',
            tokenId: '',
            printerId: '',

            getIDs: function () {
                return idList;
            },
            setIDs: function (u, p, o, t) {
                idList.userId = u;
                idList.patientId = p;
                idList.orderId = o;
                idList.tokenId = t;
            },
            setPrinter: function(p) {
                idList.printerId = p;
            },
            isPrinterPaired: function () {
                return idList.printerId !== '';
            }
        };

    return idList;
});