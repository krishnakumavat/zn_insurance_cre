/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/resource/ResourceModel",
    "zninsurancecre/model/models"
],
    function (UIComponent, Device, ResourceModel, models) {
        "use strict";

        return UIComponent.extend("zninsurancecre.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                var i18nModel = new ResourceModel({
                    bundleName: "zninsurancecre.i18n.i18n"
                });
                this.setModel(i18nModel, "i18n");

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(models.createODataModel(), "oDataModel");
                this.setModel(models.createODataTemplateModel(), "oDataTemplateModel");
                // enable routing
                this.getRouter().initialize();
            }
        });
    }
);