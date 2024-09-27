sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/odata/ODataModel"
],
    function (ResourceModel, JSONModel, Device, ODataModel, ODataModelBatch) {
        "use strict";

        return {
            /**
             * Provides runtime info for the device the UI5 app is running on as JSONModel
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createODataModel: function () {
                var sUrl = "/sap/opu/odata/SMY/UI_INSUR_PLAN_U_O2/";
                return new ODataModel(sUrl, {
                    json: true
                });
            },
            createODataTemplateModel: function () {
                var sUrl = "/sap/opu/odata/SMY/UI_INSUR_TPL_U_O2/";
                return new ODataModel(sUrl, {
                    json: true
                });
            }
        };

    });