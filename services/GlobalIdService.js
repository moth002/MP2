﻿angular.module('services')
    .factory('globalIdService', function() {
        var idList = {
            userId: '',
            patientId: '',
            orderId: '',
            tokenId: '',
            printerId: '',
            previousActivable: ''
        };

        return {
            getIDs: function() {
                return idList;
            },
            setIDs: function(u, p, o, t) {
                idList.userId = u ? u : idList.userId;
                idList.patientId = p ? p : idList.patientId;
                idList.orderId = o ? o : idList.orderId;
                idList.tokenId = t ? t : idList.tokenId;
            },
            setApiUrl: function(a) {
                idList.apiUrl = a;
            },
            setPrinter: function(p) {
                idList.printerId = p;
            },
            isPrinterPaired: function() {
                return idList.printerId !== '';
            },
            setPreviousActivable: function (pA) {
                idList.previousActivable = pA;
            }
        }

    });