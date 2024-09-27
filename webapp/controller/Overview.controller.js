sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "zninsurancecre/util/DataHelper",
    "zninsurancecre/util/UIHelper",
    "zninsurancecre/libs/lodash",
    "zninsurancecre/libs/moment",
    'sap/ui/model/Filter',
    'sap/ui/core/routing/History',
    'sap/ui/layout/SplitterLayoutData',
],
    function (Controller, JSONModel, DataHelper, UIHelper, lodash, momentjs, Filter, History, SplitterLayoutData) {
        "use strict";
        var oController;
        return Controller.extend("zninsurancecre.controller.Overview", {
            /*Helper Methods*/
            createLocalModel: function (modelName, data) {
                let model = new JSONModel();
                model.setData(data);
                model.setSizeLimit(data.length);
                this.getView().setModel(model, modelName);
            },
            _handleEscape: function (oEvent) {
                oEvent.reject();
            },
            updateModelProperty: function (oModel, sPath, sValue, oContext) {
                oModel.setProperty(sPath, sValue, oContext);
            },
            hideBusyIndicator: function () {
                sap.ui.core.BusyIndicator.hide();
            },
            showBusyIndicator: function () {
                sap.ui.core.BusyIndicator.show();
                sap.ui.core.BusyIndicator.show(0);
            },
            getConstants: function (variable) {
                switch (variable) {
                    case "supplier":
                        return DataHelper._getVendor() !== "" && DataHelper._getVendor() !== undefined ? DataHelper._getVendor() : "600000011";
                        break;
                    case 'dateFormat':
                        let _userDateFormat = sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("medium");
                        return _userDateFormat && _userDateFormat !== undefined && _userDateFormat !== "" ? _userDateFormat.toUpperCase() : 'YYYY.MM.DD';
                        break;
                    case "language1": //1 Character language
                        let _language1 = sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase();
                        return _language1.substr(0, 1);
                        break;
                    case "userId":
                        if (window.location.hostname === "localhost") {
                            return "DOSHIR";
                        } else {
                            return sap.ushell.Container.getService("UserInfo") ? sap.ushell.Container.getService("UserInfo").getId() : 'DOSHIR';
                        }

                        break;
                }
            },
            /**Fragments*/
            getInstituteFragment: function () {
                let that = this;
                if (!this._instituteListDialogFragment) {
                    this._instituteListDialogFragment = sap.ui.xmlfragment("InstituteList", "zninsurancecre.view.fragments.instituteSelection", this);
                }
                this._instituteListDialogFragment.setModel(that.getView().getModel("i18n"), "i18n");
                this._instituteListDialogFragment.setModel(that.getView().getModel("instituteModel"), "instituteModel");
                this._instituteListDialogFragment.setEscapeHandler(this._handleEscape);
                return this._instituteListDialogFragment;
            },
            _getItemTemplateFragment: function () {
                let that = this;
                if (!this._itemTemplateFragment) {
                    this._itemTemplateFragment = sap.ui.xmlfragment("InstituteList", "zninsurancecre.view.fragments.itemTemplate", this);
                }
                _.forEach(that.getView().getModel("itemTemplateModel").getData(), function (obj) {
                    obj.isTemplateSelected = false;
                });
                this._itemTemplateFragment.setModel(that.getView().getModel("i18n"), "i18n");
                this._itemTemplateFragment.setModel(that.getView().getModel("itemTemplateModel"), "itemTemplateModel");
                return this._itemTemplateFragment;
            },
            _getInsuranceDetailFragment: function (insuranceDetailHeaderModel, insuranceDetailModel) {
                let that = this;
                if (!this._insuranceDetailsFragment) {
                    this._insuranceDetailsFragment = sap.ui.xmlfragment("InsuranceDetail", "zninsurancecre.view.fragments.insuranceDetails", this);
                }
                this._insuranceDetailsFragment.setModel(that.getView().getModel("i18n"), "i18n");
                this._insuranceDetailsFragment.setModel(that.getView().getModel("instituteModel"), "instituteModel");
                this._insuranceDetailsFragment.setModel(insuranceDetailHeaderModel, "insuranceDetailHeaderModel");
                this._insuranceDetailsFragment.setModel(insuranceDetailModel, "insuranceDetailModel");
                return this._insuranceDetailsFragment;
            },
            _getTemplateDetailFragment: function (insuranceTemplateModel, insuranceTemplateObject) {
                let that = this;
                if (!this._insuranceTemplateDetailFragment) {
                    this._insuranceTemplateDetailFragment = sap.ui.xmlfragment("InsuranceTemplateDetail", "zninsurancecre.view.fragments.templateDetails", this);
                }

                insuranceTemplateObject["isEdit"] = false;

                var insuranceTemplateModel = new JSONModel();
                insuranceTemplateModel.setData(insuranceTemplateObject);
                that.getView().setModel(insuranceTemplateModel, "insuranceTemplateModel");

                this._insuranceTemplateDetailFragment.setModel(that.getView().getModel("i18n"), "i18n");
                this._insuranceTemplateDetailFragment.setModel(that.getView().getModel("insuranceTemplateModel"), "insuranceTemplateModel");
                console.log(that.getView().getModel("insuranceTemplateModel").getData());
                return this._insuranceTemplateDetailFragment;
            },
            _getItemDetailsFragment: function (_itemObj) {
                var that = this;
                if (!this._itemDetailsFragment) {
                    this._itemDetailsFragment = sap.ui.xmlfragment("ItemDetails",
                        "zninsurancecre.view.fragments.insuranceItemDetails", this);
                }
                let insuranceItemDetailModel = new JSONModel();
                _.forEach(_.keys(_itemObj), function (_key) {
                    insuranceItemDetailModel.setProperty("/" + _key, _itemObj[_key]);
                });
                that.getView().setModel(insuranceItemDetailModel, "insuranceItemDetailModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceItemDetailModel"), "insuranceItemDetailModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceCriteriaModel"), "insuranceCriteriaModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceCaseTypeModel"), "insuranceCaseTypeModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceCycleDurationModel"), "insuranceCycleDurationModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceCurrencyModel"), "insuranceCurrencyModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("insuranceUOMModel"), "insuranceUOMModel");
                this._itemDetailsFragment.setModel(that.getView().getModel("i18n"), "i18n");
                return this._itemDetailsFragment;
            },
            _getCreateTemplateFragment: function () {
                var that = this;
                if (!this._createTemplateFragment) {
                    this._createTemplateFragment = sap.ui.xmlfragment("CreateTemplate",
                        "zninsurancecre.view.fragments.createTemplate", this);
                }

                that.getView().getModel("createTemplateModel").setProperty("/templateId", "");
                that.getView().getModel("createTemplateModel").setProperty("/templateDescription", "");
                that.getView().getModel("createTemplateModel").setProperty("/criteriaKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/caseTypeKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/value", "");
                that.getView().getModel("createTemplateModel").setProperty("/coverage", "");
                that.getView().getModel("createTemplateModel").setProperty("/limitAmount", "");
                that.getView().getModel("createTemplateModel").setProperty("/limitAmountKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/limitQuantity", "");
                that.getView().getModel("createTemplateModel").setProperty("/limitUnitKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/cycleDurationType", "");
                that.getView().getModel("createTemplateModel").setProperty("/cycleDurationTypeKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/amount", "");
                that.getView().getModel("createTemplateModel").setProperty("/amountKey", "");
                that.getView().getModel("createTemplateModel").setProperty("/detailConfiguration", []);

                this._createTemplateFragment.setModel(that.getView().getModel("insuranceItemDetailModel"), "insuranceItemDetailModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceCriteriaModel"), "insuranceCriteriaModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceCaseTypeModel"), "insuranceCaseTypeModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceCycleDurationModel"), "insuranceCycleDurationModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceCurrencyModel"), "insuranceCurrencyModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceUOMModel"), "insuranceUOMModel");
                this._createTemplateFragment.setModel(that.getView().getModel("createTemplateModel"), "createTemplateModel");
                this._createTemplateFragment.setModel(that.getView().getModel("insuranceCurrencyModel"), "insuranceCurrencyModel");
                this._createTemplateFragment.setModel(that.getView().getModel("i18n"), "i18n");
                return this._createTemplateFragment;
            },
            _getValueHelpFragment: function (_data, _title) {
                console.log(_data);
                var that = this;
                if (!this._valueHelpFragment) {
                    this._valueHelpFragment = sap.ui.xmlfragment("ValueHelp",
                        "zninsurancecre.view.fragments.valueHelp", this);
                }
                that.getView().getModel("viewModel").setProperty("/valueHelpTitle", _title);
                let valueHelpModel = new JSONModel();
                valueHelpModel.setData(_data);
                valueHelpModel.setSizeLimit(_data.length);
                that.getView().setModel(valueHelpModel, "valueHelpModel");
                this._valueHelpFragment.setModel(valueHelpModel, "valueHelpModel");
                this._valueHelpFragment.setModel(that.getView().getModel("viewModel"), "viewModel");
                this._valueHelpFragment.setModel(that.getView().getModel("i18n"), "i18n");
                return this._valueHelpFragment;
            },
            onInit: function () {
                oController = this;
                oController.isNewService = false;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oModel);
                this.integrationUrl = null;
            },
            onBeforeRendering: function () {

            },
            onAfterRendering: function () {
                let that = this;
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                this.oDataModel = this.getView().getModel("oDataModel");
                this.oDataTemplateModel = this.getView().getModel("oDataTemplateModel");
                if (this.oDataModel) {
                    that.integrationUrl = this.oDataModel.sServiceUrl;
                }
                if (this.oDataTemplateModel) {
                    that.integrationUrlTemplate = this.oDataTemplateModel.sServiceUrl;
                }
                that._initModels();
                that._initFragments();
                if (DataHelper._getInstitute() === null || DataHelper._getInstitute() === undefined) {
                    that._getInstituteList().then(function (oSuccess) {
                        if (oSuccess.results.length > 0) {
                            _.forEach(oSuccess.results, function (obj) {
                                obj.code = obj.Org;
                                obj.description = obj.OrgText;
                            });
                            that.createLocalModel("instituteModel", oSuccess.results);
                            that.hideBusyIndicator();
                            that.getInstituteFragment().open();
                        }
                        else {
                            sap.m.MessageBox.show(oBundle.getText("lblMsgNoInstituteFound"), {
                                title: oBundle.getText("lblWarning")
                            });
                        }

                    }, function (oError) {
                        that.hideBusyIndicator();
                    });
                }
                //that._onLoadData();
            },
            onExit: function () {

            },
            _initModels: function () {
                let that = this;
                let _arr = [];

                var insurancePlanTableModel = new JSONModel();
                insurancePlanTableModel.setData(_arr);
                that.getView().setModel(insurancePlanTableModel, "insurancePlanTableModel");

                var insuranceDetailHeaderModel = new JSONModel();
                insuranceDetailHeaderModel.setData([]);
                that.getView().setModel(insuranceDetailHeaderModel, "insuranceDetailHeaderModel");

                var insuranceDetailModel = new JSONModel();
                insuranceDetailModel.setData(_arr);
                that.getView().setModel(insuranceDetailModel, "insuranceDetailModel");

                var insuranceDetailMasterModel = new JSONModel();
                insuranceDetailMasterModel.setData(_arr);
                that.getView().setModel(insuranceDetailMasterModel, "insuranceDetailMasterModel");

                var viewModel = new JSONModel();
                viewModel.setData(_arr);
                viewModel.setProperty("/headerTitle", "");
                viewModel.setProperty("/isInstituteSelected", false);
                viewModel.setProperty("/userDateFormat", that.getConstants("dateFormat"));
                viewModel.setProperty("/mainSplitterWidth", "100%");
                viewModel.setProperty("/tableContentWidth", "100%");
                viewModel.setProperty("/isShowDetail", false);
                viewModel.setProperty("/isNewPlanCreate", false);
                viewModel.setProperty("/isInsuranceApp", true);
                viewModel.setProperty("/isTemplateApp", false);
                that.getView().setModel(viewModel, "viewModel");

                var createTemplateModel = new JSONModel();
                createTemplateModel.setProperty("/templateId", "");
                createTemplateModel.setProperty("/templateDescription", "");
                createTemplateModel.setProperty("/criteriaKey", "");
                createTemplateModel.setProperty("/caseTypeKey", "");
                createTemplateModel.setProperty("/value", "");
                createTemplateModel.setProperty("/coverage", "");
                createTemplateModel.setProperty("/limitAmount", "");
                createTemplateModel.setProperty("/limitAmountKey", "");
                createTemplateModel.setProperty("/limitQuantity", "");
                createTemplateModel.setProperty("/limitUnitKey", "");
                createTemplateModel.setProperty("/cycleDurationType", "");
                createTemplateModel.setProperty("/cycleDurationTypeKey", "");
                createTemplateModel.setProperty("/amount", "");
                createTemplateModel.setProperty("/amountKey", "");
                createTemplateModel.setProperty("/detailConfiguration", []);
                that.getView().setModel(createTemplateModel, "createTemplateModel");
            },
            _initFragments: function () {
                if (!this._itemDetailFragment) {
                    this._itemDetailFragment = sap.ui.xmlfragment("insuranceItemDetailFragment", "zninsurancecre.view.fragments.insuranceItemDetail", this);
                }
            },
            /*Screen Interactions*/
            _onSelectOrganization: function (oEvent) {
                let that = this;
                DataHelper._setInstitute("");
                that.getInstituteFragment().open();
            },
            _onChooseInstitute: function (oEvent) {

            },
            _onPlanVersionChange: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();

            },
            _onInstitutionSelect: function (oEvent) {
                let that = this;
                let _instituteSelection = oEvent.getSource().getBindingContext("instituteModel").getObject();
                oEvent.getSource().oParent.oParent.close();
                DataHelper._setInstitute(_instituteSelection.code);
                that.getView().getModel("viewModel").setProperty("/headerTitle", _instituteSelection.description);
                that.getView().getModel("viewModel").setProperty("/isInstituteSelected", true);
                that._instituteListDialogFragment = null;
                that._onLoadConfiguration();
            },
            _createInsuranceDetailView: function (insuranceDetailHeaderModel, insuranceDetailModel) {
                let that = this;
                let _oLd = new SplitterLayoutData({
                    resizable: true,
                    size: "70%",
                    maxSize: "70%"
                });
                let _detailFragment = that._getInsuranceDetailFragment(insuranceDetailHeaderModel, insuranceDetailModel);
                var oContent = new sap.m.VBox({
                    width: "100%",
                    height: "100%",
                    items: _detailFragment,
                    layoutData: _oLd
                });
                console.log(insuranceDetailHeaderModel);
                insuranceDetailModel.setProperty("/isEdit", false);
                _detailFragment.setModel(insuranceDetailHeaderModel, "insuranceDetailHeaderModel");
                _detailFragment.setModel(insuranceDetailModel, "insuranceDetailModel");
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", true);
                return oContent;
            },
            _createTemplateDetailView: function (insuranceTemplateModel, insuranceTemplateObject) {
                let that = this;
                let _oLd = new SplitterLayoutData({
                    resizable: true,
                    size: "70%",
                    maxSize: "70%"
                });
                let _detailFragment = that._getTemplateDetailFragment(insuranceTemplateModel, insuranceTemplateObject);
                var oContent = new sap.m.VBox({
                    width: "100%",
                    height: "100%",
                    items: _detailFragment,
                    layoutData: _oLd
                });


                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", true);
                return oContent;
            },
            _onViewInsuranceDetails: function (oEvent) {
                let that = this;
                let _insuranceObject = oEvent.getSource().getBindingContext("insurancePlanTableModel").getObject();
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                //Load Details
                console.log(_insuranceObject);
                that._onLoadInsuranceDetails(_insuranceObject).then(function (oSuccess) {
                    let _obj = _.cloneDeep(oSuccess);

                    _obj["insuranceNumber"] = _obj.InsuranceBP;
                    _obj["insuranceName"] = _obj.BusinessPartnerFullName;
                    _obj["insuranceType"] = _obj.InsType === "IP" ? oBundle.getText("lblInPatient") : _obj.InsType === "OP" ? oBundle.getText("lblOutPatient") : "";
                    _obj["isInPatient"] = _obj.InsType === "IP";

                    _.forEach(_.keys(_obj), function (_key) {
                        that.getView().getModel("insuranceDetailHeaderModel").setProperty("/" + _key, _obj[_key]);
                    });
                    _obj.to_Plans.results = _.uniqBy(_obj.to_Plans.results, 'PlanId');

                    _.forEach(_obj.to_Plans.results, function (obj) {
                        obj.isEdit = false;
                        obj.isModified = false;
                        obj.isNewPlan = false;
                    });
                    that.getView().getModel("insuranceDetailModel").setData(_.filter(_obj.to_Plans.results, { "Canceled": false }));
                    console.log(_obj.to_Plans.results);
                    if (_obj.to_Plans.results.length === 0) {
                        that.hideBusyIndicator();
                        return;
                    }
                    that._loadPlanDetails(_.filter(_obj.to_Plans.results, { "Canceled": false })).then(function (oSuccess) {
                        console.log(oSuccess);

                        //Set Master Data Array
                        let _masterDataArr = [];
                        _.forEach(oSuccess.__batchResponses, function (_batchObj) {
                            _.forEach(_batchObj.data.results, function (obj) {
                                _masterDataArr.push(obj)
                            });
                        });
                        _masterDataArr = _.orderBy(_masterDataArr, 'PlanId', 'asc');
                        that.getView().getModel("insuranceDetailMasterModel").setData(_.uniqBy(_masterDataArr, 'PlanId'));

                        _.forEach(that.getView().getModel("insuranceDetailModel").getData(), function (obj) {
                            _.forEach(oSuccess.__batchResponses, function (_batchObj) {
                                if (_.find(_batchObj.data.results, { "PlanId": obj.PlanId })) {
                                    if (_.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"].length > 1) {
                                        _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"] =
                                            _.orderBy(_.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"], 'PlanVersion', 'desc');
                                    }
                                    obj["planVersions"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"];
                                    obj["planDetails"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"];
                                    obj["planItems"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"][0]["to_PlanItem"]["results"];
                                    obj["isMultiVersion"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"].length > 1;
                                    obj["isHighestVersion"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"][0]["PlanVersion"];
                                    obj["planKey"] = _.find(_batchObj.data.results, { "PlanId": obj.PlanId })["to_PlanVers"]["results"][0]["PlanVersion"];
                                    _.forEach(obj["planItems"], function (item) {
                                        item.isNew = false;
                                    });
                                }
                            })
                        });
                        _.forEach(that.getView().getModel("insuranceDetailModel").getData(), function (obj) {
                            _.forEach(obj["planDetails"], function (_planObj) {
                                _planObj["validFrom"] = moment(_planObj.Datefrom).format("DD.MM.YYYY");
                                _planObj["validTo"] = moment(_planObj.Dateto).format("DD.MM.YYYY");
                            })
                            _.forEach(obj["planItems"], function (_itemObj) {

                                _itemObj["createdOn"] = moment(_itemObj.CreatedAt).format("DD.MM.YYYY");
                                _itemObj["createdAt"] = moment(_itemObj.CreatedAt).format("HH:MM A");
                                _itemObj["to_PlanCoverage"]["Crit"] = UIHelper.padWithZeros(_itemObj["to_PlanCoverage"]["Crit"], 2);
                                _itemObj["to_PlanCoverage"]["CritText"] = _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(_itemObj["to_PlanCoverage"]["Crit"], 2) }) ?
                                    _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(_itemObj["to_PlanCoverage"]["Crit"], 2) })["description"] : _itemObj["to_PlanCoverage"]["Crit"];


                                _itemObj["to_PlanCoverage"]["CaseTypeText"] = _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": _itemObj["to_PlanCoverage"]["CaseType"] }) ?
                                    _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": _itemObj["to_PlanCoverage"]["CaseType"] })["description"] : _itemObj["to_PlanCoverage"]["CaseType"];

                                _itemObj["to_PlanLimits"]["CycleDurTypeText"] = _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": _itemObj["to_PlanLimits"]["CycleDurType"] }) ?
                                    _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": _itemObj["to_PlanLimits"]["CycleDurType"] })["description"] : _itemObj["to_PlanLimits"]["CycleDurType"];

                                _itemObj.isEdit = false;
                                _itemObj.isModified = false;
                                let _arr = [];

                                if (_itemObj["to_PlanIE"].results.length > 0) {
                                    _.forEach(_itemObj["to_PlanIE"].results, function (obj) {
                                        obj["detailConfigCriteriaKey"] = UIHelper.padWithZeros(obj.Crit, 2);
                                        obj["detailConfigCriteria"] = UIHelper.padWithZeros(obj.Crit, 2);
                                        obj["detailConfigValue"] = obj.Val;
                                        obj["detailConfigQuantity"] = obj.LimitQuan;
                                        obj["detailConfigUnit"] = obj.LimitUnit;
                                        obj["detailConfigAmount"] = obj.LimitCurr;
                                        obj["detailConfigCurrency"] = obj.LimitCuky;
                                        obj["detailConfigCycleDuration"] = obj.CycleDur;
                                        obj["detailConfigCycleDurationType"] = obj.CycleDurType;
                                        obj["isTemplateItem"] = false;
                                    });
                                    _arr = _itemObj["to_PlanIE"].results;
                                }
                                else {
                                    _arr.push(
                                        {
                                            "detailConfigCriteriaKey": null,
                                            "detailConfigCriteria": "",
                                            "detailConfigValue": "",
                                            "detailConfigQuantity": "",
                                            "detailConfigUnit": "",
                                            "detailConfigAmount": "",
                                            "detailConfigCurrency": "",
                                            "detailConfigCycleDuration": "",
                                            "detailConfigCycleDurationType": "",
                                        }
                                    )
                                }



                                _itemObj["planItemsDetailConfiguration"] = _arr;
                                _itemObj.visibleRowCount = _itemObj["planItemsDetailConfiguration"].length;
                            });
                        });
                        console.log(that.getView().getModel("insuranceDetailModel").getData());
                        that.getView().getModel("insuranceDetailModel").updateBindings();


                    }, function (oError) {

                    });

                })
                .catch(function(err) {
                    console.error(err);
                  })
                  .finally(function() {
                oController.oSplitter = that.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                if (!that.getView().getModel("viewModel").getProperty("/isDetailViewOpen")) {
                    oController.oSplitter.addContentArea(that._createInsuranceDetailView(that.getView().getModel("insuranceDetailHeaderModel"), that.getView().getModel("insuranceDetailModel")));
                } else {
                    oController.oSplitter.removeContentArea(1)
                    if(that._insuranceDetailsFragment){
                        that._insuranceDetailsFragment.destroy(true);
                        that._insuranceDetailsFragment = undefined
                    }
                    oController.oSplitter.addContentArea(that._createInsuranceDetailView(that.getView().getModel("insuranceDetailHeaderModel"), that.getView().getModel("insuranceDetailModel")));
                }
                  });;

                
            },
            _onViewTemplateDetails: function (oEvent) {
                let that = this;

                that.getView().getModel("viewModel").setProperty("/isInsuranceApp", false);
                that.getView().getModel("viewModel").setProperty("/isTemplateApp", true);
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", false);

                if (aContentAreas.length > 1) {
                    oController.oSplitter.removeContentArea(aContentAreas[1]);
                }

                let _insuranceTemplateObject = oEvent.getSource().getBindingContext("insuranceTemplateTableModel").getObject();
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                console.log(_insuranceTemplateObject);
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                if (!that.getView().getModel("viewModel").getProperty("/isDetailViewOpen")) {
                    oController.oSplitter.addContentArea(that._createTemplateDetailView(that.getView().getModel("insuranceTemplateTableModel"), _insuranceTemplateObject));
                }
            },
            _onViewItemDetails: function (oEvent) {
                let that = this;
                let _itemObject = oEvent.getSource().getParent().getBindingContext("insuranceDetailModel").getObject();
                console.log(_itemObject);
                that._getItemDetailsFragment(_itemObject).open();
            },
            _onToggleEdit: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                oController.headerObject = _object;
                _object["isEdit"] = !_object["isEdit"];
                _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["isEdit"] = _object["isEdit"];
                that.getView().getModel("insuranceDetailModel").updateBindings();
            },
            _onCreateNewVersion: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                let _msg = oBundle.getText("lblConfirmationNewVersion");
                sap.m.MessageBox.warning(_msg, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            oController.headerObject = _object;
                            _object["isEdit"] = !_object["isEdit"];
                            _object["isNewVersion"] = true
                            oController.isNewVersion = true;
                            _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["isEdit"] = _object["isEdit"];
                            that.getView().getModel("insuranceDetailModel").updateBindings();
                        }
                    }
                });
            },
            _onDeleteItemVersion: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                let _msg = oBundle.getText("lblConfirmationDeletePlan");
                sap.m.MessageBox.warning(_msg, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            if (_.has(_object, 'planDetails')) {
                                let _params = {
                                    "Org": DataHelper._getInstitute(),
                                    "PlanId": _object["PlanId"],
                                    "PlanVersion": _object["planDetails"][0]["PlanVersion"]
                                }
                                that._onCallFunctionImport("Cancel", _params, true, false).then(function (oSuccess) {
                                    sap.m.MessageToast.show(oBundle.getText("lblPlanDeleted"));
                                    that._onCloseDetailView(false);
                                    that._onLoadData();
                                    that.getView().getModel("viewModel").setProperty("/isNewPlanCreate", false);
                                }, function (oError) {

                                });
                            }
                            else {
                                that._onCloseDetailView(false);
                                that._onLoadData();
                                that.getView().getModel("viewModel").setProperty("/isNewPlanCreate", false);
                            }

                        }
                    }
                });
            },
            _onDeleteTemplateVersion: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _object = that.getView().getModel("insuranceTemplateModel").getData();
                let _msg = oBundle.getText("lblConfirmationDeleteTemplate");
                sap.m.MessageBox.warning(_msg, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            let _params = {
                                "TemplateUuid": _object["TemplateUuid"]
                            }
                            that._onCallFunctionImport("Cancel", _params, true, true).then(function (oSuccess) {
                                sap.m.MessageToast.show(oBundle.getText("lblPlanDeleted"));
                                that._onCloseDetailView(true);
                                that._onLoadData();
                            }, function (oError) {

                            });

                        }
                    }
                });
            },
            _onToggleEditTemplate: function (oEvent) {
                let that = this;
                that.getView().getModel("insuranceTemplateModel").setProperty("/isEdit", !that.getView().getModel("insuranceTemplateModel").getProperty("/isEdit"));
                that.getView().getModel("insuranceDetailModel").updateBindings();
            },
            _onToggleEditItem: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                _object["isEdit"] = !_object["isEdit"];
                that.getView().getModel("viewModel").setProperty("/isItemEdit", _object["isEdit"]);
                that.getView().getModel("insuranceDetailModel").updateBindings();
                let _detailConfigTable = sap.ui.core.Fragment.byId("insuranceItemDetailFragment", "detailConfigurationTable");

            },
            _onSaveEditItem: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                if (_.filter(_object.planItemsDetailConfiguration.length, { "isTemplateItem": false }) > 0) {
                    _.forEach(_.filter(_object.planItemsDetailConfiguration, { "isTemplateItem": true }), function (obj) {
                        obj["Crit"] = obj["detailConfigCriteriaKey"];
                        obj["CycleDur"] = obj["detailConfigCycleDuration"];
                        obj["CycleDurType"] = obj["detailConfigCycleDurationType"];
                        obj["LimitCuky"] = obj["detailConfigCurrency"];
                        obj["LimitCurr"] = obj["detailConfigAmount"];
                        obj["LimitQuan"] = obj["detailConfigQuantity"];
                        obj["LimitUnit"] = obj["detailConfigUnit"];

                        delete obj["detailConfigCriteriaKey"];
                        delete obj["detailConfigCycleDuration"];
                        delete obj["detailConfigCycleDurationType"];
                        delete obj["detailConfigCurrency"];
                        delete obj["detailConfigValue"];
                        delete obj["detailConfigQuantity"];
                        delete obj["detailConfigUnit"];
                        delete obj["detailConfigAmount"];
                        delete obj["detailConfigCriteria"];


                        that._callUpdateOperation(obj, obj["__metadata"]["etag"]).then(function (oSuccess) {

                        }, function (oError) {

                        });

                    });
                }
            },
            _onAddNewItem: function (oEvent) {
                let that = this;
                that._getItemTemplateFragment().open();
            },
            _onDeleteEditItem: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();

                let _msg = oBundle.getText("lblConfirmationDelete");
                sap.m.MessageBox.warning(_msg, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            if (_object.isNew) {
                                _.remove(oController.headerObject.planItems, {
                                    "TemplateUuid": _object.TemplateUuid
                                });
                                oController.getView().getModel("insuranceDetailModel").refresh();
                            }
                            else {
                                that._onDeleteRecord(_object, _object["__metadata"]["etag"], false).then(function (oSuccess) {
                                    sap.m.MessageToast.show(oBundle.getText("lblItemDeleted"));
                                    that._onCloseDetailView(true);
                                    that._onLoadData();
                                }, function (oError) {
                                });
                            }
                        }
                    }
                });
            },
            _onDeleteDetailConfigTemplate: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceTemplateModel").getObject();
                let _msg = oBundle.getText("lblConfirmationDelete");
                sap.m.MessageBox.warning(_msg, {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            that._onDeleteRecord(_object, _object["__metadata"]["etag"], true).then(function (oSuccess) {
                                sap.m.MessageToast.show(oBundle.getText("lblItemDeleted"));
                                that._onCloseDetailView(true);
                                that._onLoadData();
                            }, function (oError) {
                            });
                        }
                    }
                });
            },
            _onAddNewPlan: function (oEvent) {
                let that = this;
                let _data = oEvent.getSource().getParent().getModel("insuranceDetailModel").getData();
                let _blankObj = _data.length > 0 ? _.clone(_data[_data.length - 1]) : {};

                if (_blankObj) {
                    //Clear Keys
                    _.forEach(_.keys(_blankObj), function (_key) {
                        if (!_.isBoolean(_blankObj[_key])) {
                            switch (_key) {
                                case "planDetails":
                                    _.forEach(_blankObj[_key], function (obj) {
                                        obj["PlanFamily"] = false;
                                        obj["PlanHdrLimit"] = "";
                                        obj["PlanHdrLimitCuky"] = "";
                                        obj["PlanId"] = "NEWPLAN";
                                        obj["PlanVersion"] = "1";
                                        obj["Datefrom"] = new Date();
                                        obj["Dateto"] = new Date();
                                    });
                                    break;
                                default:
                                    _blankObj[_key] = _.isArray(_blankObj[_key]) ? [] : "";
                                    break;
                            }

                        }
                    });
                }

                _blankObj["PlanId"] = "NEWPLAN";
                _blankObj["PlanDesc"] = "New Plan";
                _blankObj["isNewPlan"] = true;
                _blankObj["isEdit"] = true;



                oController.headerObject = _blankObj;
                _data.push(_blankObj);
                that.getView().getModel("insuranceDetailModel").setData(_data);
                that.getView().getModel("insuranceDetailModel").refresh();
                that.getView().getModel("insuranceDetailModel").updateBindings();
                that.getView().getModel("viewModel").setProperty("/tabSelectedKey", "NEWPLAN");
                that.getView().getModel("viewModel").setProperty("/isNewPlanCreate", true);

            },
            _onAddDetailConfiguration: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                let _blankArrObj =
                {
                    "detailConfigCriteria": "",
                    "detailConfigValue": "",
                    "detailConfigQuantity": "",
                    "detailConfigUnit": "",
                    "detailConfigAmount": "",
                    "detailConfigCurrency": "",
                    "detailConfigCycleDuration": "",
                    "detailConfigCycleDurationType": "",
                    "isTemplateItem": false
                }
                _object["planItemsDetailConfiguration"].push(_blankArrObj);
                _object["visibleRowCount"] = _object["planItemsDetailConfiguration"].length;

                that.getView().getModel("insuranceDetailModel").refresh();
                that.getView().getModel("insuranceDetailModel").updateBindings();
                console.log(that.getView().getModel("insuranceDetailModel").getData());
            },
            _onAddDetailConfigurationTemplate: function (oEvent) {
                let that = this;
                let _blankArrObj =
                {
                    "detailConfigCriteria": "",
                    "detailConfigValue": "",
                    "detailConfigQuantity": "",
                    "detailConfigUnit": "",
                    "detailConfigAmount": "",
                    "detailConfigCurrency": "",
                    "detailConfigCycleDuration": "",
                    "detailConfigCycleDurationType": "",
                }
                that.getView().getModel("createTemplateModel").getProperty("/detailConfiguration").push(_blankArrObj);
                that.getView().getModel("createTemplateModel").refresh();
                that.getView().getModel("createTemplateModel").updateBindings();
                console.log(that.getView().getModel("createTemplateModel").getData());
            },
            _onAddDetailConfigurationTemplateEdit: function (oEvent) {
                let that = this;
                let _object = oController.getView().getModel("insuranceTemplateModel").getData();
                if (_object.to_PlanTplIE.results.length > 0) {
                    let _blankArrObj = _.cloneDeep(_object.to_PlanTplIE.results[0]);
                    let _mappingKeys = ["Crit", "CycleDur", "CycleDurType", "LimitCuky", "LimitCurr", "LimitQuan", "LimitUnit", "Val"];
                    _.forEach(_mappingKeys, function (_key) {
                        _blankArrObj[_key] = "";
                    });
                    _blankArrObj.isNew = true;
                    oController.getView().getModel("insuranceTemplateModel").getData()["to_PlanTplIE"]["results"].push(_blankArrObj);
                }
                oController.getView().getModel("insuranceTemplateModel").refresh();
                oController.getView().getModel("insuranceTemplateModel").updateBindings();

            },
            _onInsuranceHeaderDateChange: function (oEvent) {
                let that = this;
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                _object["isModified"] = true;
                if (_.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })) {
                    if (_.has(_.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] }), 'planDetails')) {
                        _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["planDetails"][0]["Datefrom"] = oEvent.getParameter("from");
                        _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["planDetails"][0]["Dateto"] = oEvent.getParameter("to");
                        _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["planDetails"][0]["validFrom"] = moment(oEvent.getParameter("from")).format("DD.MM.YYYY");
                        _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["planDetails"][0]["validTo"] = moment(oEvent.getParameter("to")).format("DD.MM.YYYY");
                        _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": _object["PlanId"] })["isModified"] = _object["isModified"];
                        that.getView().getModel("insuranceDetailModel").updateBindings();
                    }
                }
            },
            _onCurrencyValueHelp: function (oEvent) {
                let that = this;
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                oController.dataObject = _object;
                oController.valueHelpKey = "CURRENCY";
                that._getValueHelpFragment(that.getView().getModel("insuranceCurrencyModel").getData(), oBundle.getText("lblSelectCurrency")).open();
            },
            _onCurrencyValueHelpItem: function (oEvent) {
                let that = this;
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                let _object = oEvent.getSource().getBindingContext("insuranceDetailModel").getObject();
                oController.dataObject = _object;
                console.log(_object);
                oController.valueHelpKey = "CURRENCYITEM";
                that._getValueHelpFragment(that.getView().getModel("insuranceCurrencyModel").getData(), oBundle.getText("lblSelectCurrency")).open();
            },
            _onSelectValueHelp: function (oEvent) {
                let that = this;
                if (_.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": oController.dataObject["PlanId"] })) {
                    switch (oController.valueHelpKey) {
                        case "CURRENCY":
                            _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": oController.dataObject["PlanId"] })["planDetails"][0]["PlanHdrLimitCuky"] = oEvent.getParameter("selectedItem").getTitle();
                            break;
                        case "CURRENCYITEM":
                            let _headerObj = _.find(that.getView().getModel("insuranceDetailModel").getData(), { "PlanId": oController.dataObject["PlanId"] });
                            if (_headerObj) {
                                _.find(_headerObj["planItems"], { "PlanItemUuid": oController.dataObject.PlanItemUuid })["to_PlanCopay"]["CopayCurr"] = oEvent.getParameter("selectedItem").getTitle();
                            }
                            //["planItems"][0]["PlanHdrLimitCuky"] = oEvent.getParameter("selectedItem").getTitle();
                            break;
                    }
                }
                that.getView().getModel("insuranceDetailModel").updateBindings();
            },
            _onSelectTemplates: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _selectedItems = oEvent.getSource().oParent.getModel("itemTemplateModel").getData();
                if (_.filter(_selectedItems, { "isTemplateSelected": true }).length > 0) {
                    _.forEach(_.filter(_selectedItems, { "isTemplateSelected": true }), function (_templateObj) {
                        if (_.has(oController.headerObject, 'planItems')) {

                        }
                        else {
                            oController["headerObject"]["planItems"] = [];
                        }
                        if (!_.find(oController.headerObject.planItems, { "TemplateUuid": _templateObj.TemplateUuid })) {
                            let _obj = _.clone(_templateObj);
                            _obj["to_PlanCopay"] = _templateObj["to_PlanTplCopay"];
                            _obj["to_PlanCoverage"] = _templateObj["to_PlanTplCoverage"];
                            _obj["to_PlanIE"] = _templateObj["to_PlanTplIE"];
                            _obj["to_PlanLimits"] = _templateObj["to_PlanTplLimits"];
                            _obj["isEdit"] = false;
                            _obj["isModified"] = false;
                            _obj["isNew"] = true;
                            _obj["createdOn"] = moment(new Date()).format("DD.MM.YYYY");
                            _obj["createdAt"] = moment(new Date()).format("HH:MM A");
                            _obj["to_PlanCoverage"]["CritText"] = _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(_obj["to_PlanCoverage"]["Crit"], 2) }) ?
                                _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(_obj["to_PlanCoverage"]["Crit"], 2) })["description"] : _obj["to_PlanCoverage"]["Crit"];


                            _obj["to_PlanCoverage"]["CaseTypeText"] = _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": _obj["to_PlanCoverage"]["CaseType"] }) ?
                                _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": _obj["to_PlanCoverage"]["CaseType"] })["description"] : _obj["to_PlanCoverage"]["CaseType"];

                            _obj["to_PlanLimits"]["CycleDurTypeText"] = _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": _obj["to_PlanLimits"]["CycleDurType"] }) ?
                                _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": _obj["to_PlanLimits"]["CycleDurType"] })["description"] : _obj["to_PlanLimits"]["CycleDurType"];


                            let _arr = [];
                            let _configObj = {
                                "detailCriteriaKey": null,
                                "detailConfigCriteria": "",
                                "detailConfigValue": "",
                                "detailConfigQuantity": "",
                                "detailConfigUnit": "",
                                "detailConfigAmount": "",
                                "detailConfigCurrency": "",
                                "detailConfigCycleDuration": "",
                                "detailConfigCycleDurationType": "",
                            };

                            if (_obj["to_PlanIE"].results.length === 0) {
                                _arr.push(_configObj);
                            }
                            else {
                                _.forEach(_obj["to_PlanIE"].results, function (obj) {
                                    obj["detailConfigCriteriaKey"] = UIHelper.padWithZeros(obj.Crit, 2);
                                    obj["detailConfigCriteria"] = UIHelper.padWithZeros(obj.Crit, 2);
                                    obj["detailConfigValue"] = obj.Val;
                                    obj["detailConfigQuantity"] = obj.LimitQuan;
                                    obj["detailConfigUnit"] = obj.LimitUnit;
                                    obj["detailConfigAmount"] = obj.LimitCurr;
                                    obj["detailConfigCurrency"] = obj.LimitCuky;
                                    obj["detailConfigCycleDuration"] = obj.CycleDur;
                                    obj["detailConfigCycleDurationType"] = obj.CycleDurType;
                                    obj["isTemplateItem"] = true;
                                });
                                _arr = _obj["to_PlanIE"].results;
                            }
                            _obj["planItemsDetailConfiguration"] = _arr;
                            _obj.visibleRowCount = _obj["planItemsDetailConfiguration"].length;
                            oController.headerObject.planItems.push(_obj);
                        }

                    });

                    console.log(oController.headerObject.planItems);
                    that.getView().getModel("insuranceDetailModel").refresh();
                    that.getView().getModel("insuranceDetailModel").updateBindings();
                    oEvent.getSource().oParent.close();
                    _.forEach(oController.getView().getModel("itemTemplateModel").getData(), function (obj) {
                        obj.isTemplateSelected = false;
                    });

                } else {
                    sap.m.MessageBox.show(oBundle.getText("lblMessageSelectOneTemplate"), {
                        title: oBundle.getText("lblWarning")
                    });
                }


            },
            _onCancelDialog: function (oEvent) {
                oEvent.getSource().oParent.close()
            },
            _prepareUpdateRecord: function (_rawObject, _modifiedObj) {
                let that = this;

                let _keyMappingArray = [
                    {
                        "modifiedKey": "planDetails",
                        "originalKey": "to_PlanVers"
                    }
                ];
                let _deletionKeys = ["validFrom", "validTo"];

                _.forEach(_.keys(_modifiedObj), function (_key) {
                    let _keyMapObj = _.find(_keyMappingArray, { "modifiedKey": _key });
                    if (_keyMapObj) {
                        if (_.has(_rawObject, _keyMapObj.originalKey)) {
                            _rawObject[_keyMapObj.originalKey] = _modifiedObj[_keyMapObj.modifiedKey]
                        }
                    }
                    else {
                        if (_.has(_rawObject, _key)) {
                            _rawObject[_key] = _modifiedObj[_key]
                        }
                    }
                });
                _.forEach(_rawObject["to_PlanVers"], function (obj) {
                    _.forEach(_deletionKeys, function (_deletionKey) {
                        delete obj[_deletionKey];
                    });
                });

                console.log(_rawObject);
                return _rawObject;
            },
            _onUpdateRecord: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();

                let _updateObj = _.cloneDeep(_.find(that.getView().getModel("insuranceDetailMasterModel").getData(), { "PlanId": oController.headerObject.PlanId }));
                if (_updateObj) {
                    _updateObj = that._prepareUpdateRecord(_updateObj, oController.headerObject);
                    let _msg = [];
                    if (_updateObj["PlanId"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanId")));
                    }
                    if (_updateObj["PlanDesc"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanDescription")));
                    }
                    if (_updateObj["to_PlanVers"][0]["to_PlanItem"].results.length === 0) {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanItems")));
                    }

                    if (_msg.length > 0) {
                        sap.m.MessageBox.show(_msg.join('\r\n'), {
                            title: oBundle.getText("lblWarning")
                        });
                        return;
                    }

                    oController.showBusyIndicator();

                    console.log(_updateObj);
                    if (oController.isNewVersion) {

                        let _msg = [];
                        if (oController.headerObject["PlanId"] === "") {
                            _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanId")));
                        }
                        if (oController.headerObject["PlanDesc"] === "") {
                            _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanDescription")));
                        }
                        if (oController.headerObject["planItems"].length === 0) {
                            _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanItems")));
                        }

                        if (_msg.length > 0) {
                            sap.m.MessageBox.show(_msg.join('\r\n'), {
                                title: oBundle.getText("lblWarning")
                            });
                            return;
                        }

                        oController.showBusyIndicator();

                        that._onCreateRecordData(oController.headerObject, true).then(function (oSuccess) {
                            let _msg = oBundle.getText("lblRequestCreated", oSuccess["PlanId"]);
                            sap.m.MessageToast.show(_msg);
                            oController.hideBusyIndicator();
                            oController._onCloseDetailView(false);
                            oController._onLoadData();
                        }, function (oError) {
                            oController.hideBusyIndicator();
                            if (JSON.parse(oError.response.body)) {
                                sap.m.MessageBox.show(JSON.parse(oError.response.body).error.message.value, {
                                    title: oBundle.getText("lblError")
                                });
                                return;

                            }
                        });
                    }
                    else {
                        //Update Header Object
                        let _headerObj = UIHelper._createUpdateObject("xSMYxC_PLAN", _.cloneDeep(_updateObj), false, false);
                        that._onUpdateRecordData(_headerObj, _.cloneDeep(_updateObj), false, false);
                    }

                }
                else if (oController.headerObject && oController.headerObject.isNewPlan) {
                    //Create New Record
                    let _msg = [];
                    if (oController.headerObject["PlanId"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanId")));
                    }
                    if (oController.headerObject["PlanDesc"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanDescription")));
                    }
                    if (oController.headerObject["planItems"].length === 0) {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblPlanItems")));
                    }

                    if (_msg.length > 0) {
                        sap.m.MessageBox.show(_msg.join('\r\n'), {
                            title: oBundle.getText("lblWarning")
                        });
                        return;
                    }

                    oController.showBusyIndicator();

                    that._onCreateRecordData(oController.headerObject, false).then(function (oSuccess) {
                        let _msg = oBundle.getText("lblRequestCreated", oSuccess["PlanDesc"]);
                        sap.m.MessageToast.show(_msg);
                        oController.hideBusyIndicator();
                    }, function (oError) {
                        oController.hideBusyIndicator();
                        if (JSON.parse(oError.response.body)) {
                            sap.m.MessageBox.show(JSON.parse(oError.response.body).error.message.value, {
                                title: oBundle.getText("lblError")
                            });
                            return;

                        }
                    });
                }
            },
            _onUpdateTemplate: function (oEvent) {
                let that = this;
                let _templateObj = that.getView().getModel("insuranceTemplateModel").getData();
                if (_templateObj) {
                    let _msg = [];
                    if (_templateObj["PlanTplId"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblTemplateId")));
                    }
                    if (_templateObj["Description"] === "") {
                        _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblTemplateDescription")));
                    }
                    if (_msg.length > 0) {
                        sap.m.MessageBox.show(_msg.join('\r\n'), {
                            title: oBundle.getText("lblWarning")
                        });
                        return;
                    }

                    oController.showBusyIndicator();
                    that._onUpdateTemplateData(_templateObj);
                }
            },

            _onSwitchApplication: function (oEvent) {
                let that = this;
                that.getView().getModel("viewModel").setProperty("/isInsuranceApp", !that.getView().getModel("viewModel").getProperty("/isInsuranceApp"));
                that.getView().getModel("viewModel").setProperty("/isTemplateApp", !that.getView().getModel("viewModel").getProperty("/isTemplateApp"));
            },
            _onNavigateTemplate: function (oEvent) {
                let that = this;
                that.getView().getModel("viewModel").setProperty("/isInsuranceApp", false);
                that.getView().getModel("viewModel").setProperty("/isTemplateApp", true);
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", false);

                oController.oSplitter.removeContentArea(aContentAreas[1]);
            },
            _onCloseTemplate: function (oEvent) {
                let that = this;
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", false);

                oController.oSplitter.removeContentArea(aContentAreas[1]);
            },
            _onCreateTemplate: function (oEvent) {
                let that = this;
                that._getCreateTemplateFragment().open();
            },
            _onSaveTemplate: function (oEvent) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                let _msg = [];

                if (that.getView().getModel("createTemplateModel").getProperty("/templateId") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblTemplateId")));
                }
                if (that.getView().getModel("createTemplateModel").getProperty("/templateDescription") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblTemplateDescription")));
                }
                if (that.getView().getModel("createTemplateModel").getProperty("/criteriaKey") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblCriteria")));
                }
                if (that.getView().getModel("createTemplateModel").getProperty("/caseTypeKey") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblCaseType")));
                }
                if (that.getView().getModel("createTemplateModel").getProperty("/value") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblValue")));
                }
                if (that.getView().getModel("createTemplateModel").getProperty("/coverage") === "") {
                    _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblCoverage")));
                }
                // if (that.getView().getModel("createTemplateModel").getProperty("/limitAmount") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblAmount")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/limitAmountKey") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblAmount")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/limitQuantity") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblQuantity")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/limitUnitKey") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblQuantity")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/cycleDurationType") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblCycleDurationType")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/cycleDurationTypeKey") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblCycleDurationType")));
                // }

                // if (that.getView().getModel("createTemplateModel").getProperty("/amount") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblAmount")));
                // }
                // if (that.getView().getModel("createTemplateModel").getProperty("/amountKey") === "") {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblAmount")));
                // }

                // if (that.getView().getModel("createTemplateModel").getProperty("/detailConfiguration").length === 0) {
                //     _msg.push(oBundle.getText("validationNotBlank", oBundle.getText("lblSectionConfiguration")));
                // }

                if (_msg.length > 0) {
                    sap.m.MessageBox.show(_msg.join('\r\n'), {
                        title: oBundle.getText("lblWarning")
                    });
                    return;
                }

                oController.showBusyIndicator();

                let _planIE = [];
                _.forEach(that.getView().getModel("createTemplateModel").getProperty("/detailConfiguration"), function (obj) {
                    _planIE.push({
                        "Crit": obj.detailConfigCriteriaKey,
                        "Val": obj.detailConfigValue,
                        "LimitCurr": obj.detailConfigAmount,
                        "LimitCuky": obj.detailConfigCurrency,
                        "LimitQuan": obj.detailConfigQuantity,
                        "LimitUnit": obj.detailConfigUnit,
                        "CycleDur": obj.detailConfigCycleDuration,
                        "CycleDurType": obj.detailConfigCycleDurationType,
                    })
                });

                let _headerObj = {
                    "Description": that.getView().getModel("createTemplateModel").getProperty("/templateDescription"),
                    "PlanTplId": that.getView().getModel("createTemplateModel").getProperty("/templateId"),
                    "Org": DataHelper._getInstitute(),
                    "PlanPat": false,
                    "to_PlanTplCopay": {
                        "Copay": that.getView().getModel("createTemplateModel").getProperty("/amount") === "" || that.getView().getModel("createTemplateModel").getProperty("/amount") === undefined ? "0" : that.getView().getModel("createTemplateModel").getProperty("/amount"),
                        "CopayCurr": that.getView().getModel("createTemplateModel").getProperty("/amountKey"),
                    },
                    "to_PlanTplCoverage": {
                        "Crit": that.getView().getModel("createTemplateModel").getProperty("/criteriaKey"),
                        "Val": that.getView().getModel("createTemplateModel").getProperty("/value"),
                        "CaseType": that.getView().getModel("createTemplateModel").getProperty("/caseTypeKey"),
                        "Coverage": that.getView().getModel("createTemplateModel").getProperty("/coverage"),
                    },
                    "to_PlanTplIE": _planIE,
                    "to_PlanTplLimits": {
                        "LimitCurr": that.getView().getModel("createTemplateModel").getProperty("/limitAmount") === "" || that.getView().getModel("createTemplateModel").getProperty("/limitAmount") === undefined ? "0" : that.getView().getModel("createTemplateModel").getProperty("/limitAmount"),
                        "LimitCuky": that.getView().getModel("createTemplateModel").getProperty("/limitAmountKey"),
                        "LimitQuan": that.getView().getModel("createTemplateModel").getProperty("/limitQuantity") === "" || that.getView().getModel("createTemplateModel").getProperty("/limitQuantity") === undefined ? "0" : that.getView().getModel("createTemplateModel").getProperty("/limitQuantity"),
                        "LimitUnit": that.getView().getModel("createTemplateModel").getProperty("/limitUnitKey"),
                        "CycleDur": that.getView().getModel("createTemplateModel").getProperty("/cycleDurationType"),
                        "CycleDurType": that.getView().getModel("createTemplateModel").getProperty("/cycleDurationTypeKey"),
                    }
                }
                var oModel = new sap.ui.model.odata.ODataModel(that.integrationUrlTemplate, true);
                oModel.create("/xSMYxC_INS_PLAN_TPL", _headerObj, {
                    success: function (oData, oResponse) {
                        oController.hideBusyIndicator();
                        let _msg = oBundle.getText("lblRequestCreated", oData["Description"]);
                        sap.m.MessageToast.show(_msg);
                        oEvent.getSource().oParent.close();
                        that._onLoadData();
                    },
                    error: function (oError) {
                        oController.hideBusyIndicator();
                        if (JSON.parse(oError.response.body)) {
                            sap.m.MessageBox.show(JSON.parse(oError.response.body).error.message.value, {
                                title: oBundle.getText("lblError")
                            });
                            return;
                        }
                    }
                });
            },
            _onCancelDialog: function (oEvent) {
                oEvent.getSource().oParent.close();
            },
            _onCloseDetailView: function (isTemplate) {
                let that = this;

                that.getView().getModel("viewModel").setProperty("/isInsuranceApp", !isTemplate);
                that.getView().getModel("viewModel").setProperty("/isTemplateApp", isTemplate);
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", false);

                if (aContentAreas.length > 1) {
                    oController.oSplitter.removeContentArea(aContentAreas[1]);
                }
            },
            _onCloseDetails: function (oEvent) {
                let that = this;
                oController.oSplitter = this.byId("mainSplitter");
                var aContentAreas = oController.oSplitter.getContentAreas();
                that.getView().getModel("viewModel").setProperty("/isDetailViewOpen", false);

                if (aContentAreas.length > 1) {
                    oController.oSplitter.removeContentArea(aContentAreas[1]);
                }
            },
            /*API Integration*/
            _loadPlanDetails: function (_plans) {
                let that = this;
                that.showBusyIndicator();
                return new Promise(function (fnResolve, fnReject) {

                    var oModel = new sap.ui.model.odata.ODataModel(that.integrationUrl, true);
                    oModel.setUseBatch(true);
                    let _sGroup = jQuery.sap.uid();
                    let _batchChangeOperations = [];
                    _.forEach(_plans, function (_plansObj) {
                        let _filters = {
                            "PlanId": _plansObj.PlanId
                        }
                        let _expandEntities = ["to_PlanVers", "to_PlanVers/to_PlanItem", "to_PlanVers/to_PlanItem/to_PlanCopay", "to_PlanVers/to_PlanItem/to_PlanCoverage", "to_PlanVers/to_PlanItem/to_PlanIE", "to_PlanVers/to_PlanItem/to_PlanLimits"];
                        let _sPath = UIHelper.generateURL(oController.isNewService ? "/OrganisationsValueHelp" : "/xSMYxC_INS_PLAN", null, _filters, false, false, _expandEntities, _expandEntities.length >
                            0, false);
                        //oModel.read(_sPath, {groupId: _sGroup});
                        let _operation = oModel.createBatchOperation(_sPath, "GET");
                        _batchChangeOperations.push(_operation);
                    });

                    oModel.addBatchReadOperations(_batchChangeOperations);
                    oModel.submitBatch(function (oData, oResponse) {
                        that.hideBusyIndicator();
                        fnResolve(oData);
                    }, function (oError) {
                        that.hideBusyIndicator();
                        fnReject(oError);
                    });
                });
            },
            _onLoadInsuranceDetails: function (_insuranceObject) {
                let that = this;
                that.showBusyIndicator();
                return new Promise(function (fnResolve, fnReject) {
                    let _params = {
                        "InsuranceBP": _insuranceObject.insuranceNumber,
                        "org": DataHelper._getInstitute()
                    };
                    let _expandEntities = ["to_Plans"];
                    let _sPath = oController.isNewService ? "/OrganisationsValueHelp" : "/xSMYxI_INSURANCE";
                    _sPath = UIHelper.generateURL(_sPath, _params, null, false, false, _expandEntities, _expandEntities.length > 0, false, true);
                    var oModel = new sap.ui.model.odata.ODataModel(that.integrationUrl, true);
                    oModel.read(_sPath, null, null, null, function (oData, oResponse) {
                        that.hideBusyIndicator();
                        fnResolve(oData);
                    }, function (oError) {
                        that.hideBusyIndicator();
                        fnReject(oError);
                    });
                });
            },
            _onLoadConfiguration: function () {
                let that = this;
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();
                that._onLoadData();
            },
            _onLoadData: function () {
                let that = this;
                let oBundle = oController.getView().getModel("i18n").getResourceBundle();;
                let viewModel = that.getView().getModel("viewModel");
                that.updateModelProperty(that.getView().getModel("viewModel"), "/create-busy", true);
                let expandEntities = [];
                that.showBusyIndicator();
                Promise.all(
                    [
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/xSMYxI_INSURANCE", { org: DataHelper._getInstitute() }, ["to_InsTypeText"], true, false),//Insurance List
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/xSMYxI_PLAN_CRIT_VH", {}, expandEntities, true, false),//Insurance Plan Criteria
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/xSMYxI_CASE_TYPE_VH", {}, expandEntities, true, false),//Insurance Case Type,
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/xSMYxI_PLAN_CYCLE_DUR_TYPE_VH", {}, expandEntities, true, false),//Insurance Case Type
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/I_Currency", {}, expandEntities, true, false),//Currency
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/I_UnitOfMeasure", {}, expandEntities, true, false),//Unit of Measure
                        that._callValueHelp(oController.isNewService ? "/Insurances" : "/xSMYxC_INS_PLAN_TPL", {}, ['to_PlanTplCoverage', 'to_PlanTplIE', 'to_PlanTplLimits', 'to_PlanTplCopay'], true, true),

                    ]
                ).then(function (oSuccess) {
                    let _arr = [];
                    for (let i = 0; i < 7; i++) {
                        _.forEach(oSuccess[i].results, function (obj) {
                            switch (i) {
                                case 0:
                                    obj.insuranceNumber = obj.InsuranceBP;
                                    obj.insuranceUuid = obj.PartnerUuid;
                                    obj.insuranceProviderName = obj.BusinessPartnerFullName;
                                    obj.insuranceTypeCode = obj.InsType;
                                    obj.insuranceType = obj.to_InsTypeText["InsTypeDesc"];//obj.InsType === "IP" ? oBundle.getText("lblInPatient") : obj.InsType === "OP" ? oBundle.getText("lblOutPatient") : "";
                                    obj.createdBy = obj.Createdby;
                                    obj.createdAt = moment(obj.Createdat).format("DD.MM.YYYY");//obj.Createdat;
                                    break;
                                case 1:
                                    obj.sortNo = Number(obj.value_position);
                                    obj.code = UIHelper.padWithZeros(obj.PlanCrit, 2);
                                    obj.description = obj.PlanCrit_Text;
                                    break;
                                case 2:
                                    obj.sortNo = Number(obj.value_position);
                                    obj.code = obj.value_low;
                                    obj.description = obj.text;
                                    break;
                                case 3:
                                    obj.sortNo = Number(obj.value_position);
                                    obj.code = obj.value_low;
                                    obj.description = obj.text;
                                    break;
                                case 4:
                                    obj.code = obj.Currency;
                                    obj.description = obj.Currency_Text;
                                    break;
                                case 5:
                                    obj.code = obj.UnitOfMeasure;
                                    obj.description = obj.UnitOfMeasure_Text;
                                    break;
                                case 6:
                                    obj.templateId = obj.PlanTplId;
                                    obj.templateDescription = obj.Description;
                                    obj.isTemplateSelected = false;
                                    obj.createdBy = obj.CreatedBy;
                                    obj.createdAt = moment(obj.Createdat).format("DD.MM.YYYY");
                                    obj["to_PlanTplCoverage"]["Crit"] = UIHelper.padWithZeros(obj["to_PlanTplCoverage"]["Crit"], 2);
                                    _.forEach(obj.to_PlanTplIE.results, function (_planIE) {
                                        _planIE["Crit"] = UIHelper.padWithZeros(_planIE["Crit"], 2);
                                        _planIE["isNew"] = false;
                                    });
                                    obj["to_PlanTplCoverage"]["CritText"] = _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(obj["to_PlanTplCoverage"]["Crit"], 1) }) ?
                                        _.find(that.getView().getModel("insuranceCriteriaModel").getData(), { "code": UIHelper.padWithZeros(obj["to_PlanTplCoverage"]["Crit"], 1) })["description"] : obj["to_PlanTplCoverage"]["Crit"];

                                    obj["to_PlanTplCoverage"]["CaseTypeText"] = _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": obj["to_PlanTplCoverage"]["CaseType"] }) ?
                                        _.find(that.getView().getModel("insuranceCaseTypeModel").getData(), { "code": obj["to_PlanTplCoverage"]["CaseType"] })["description"] : obj["to_PlanTplCoverage"]["CaseType"];

                                    obj["to_PlanTplLimits"]["CycleDurTypeText"] = _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": obj["to_PlanTplLimits"]["CycleDurType"] }) ?
                                        _.find(that.getView().getModel("insuranceCycleDurationModel").getData(), { "code": obj["to_PlanTplLimits"]["CycleDurType"] })["description"] : obj["to_PlanTplLimits"]["CycleDurType"];


                                    break;
                            }
                        });
                        switch (i) {
                            case 0:
                                that.getView().getModel("insurancePlanTableModel").setData(oSuccess[i].results);
                                break;
                            case 1:
                                oSuccess[i].results.unshift({ code: "", description: "" });
                                that.createLocalModel("insuranceCriteriaModel", oSuccess[i].results);
                                break;
                            case 2:
                                oSuccess[i].results.unshift({ code: "", description: "" });
                                that.createLocalModel("insuranceCaseTypeModel", oSuccess[i].results);
                                break;
                            case 3:
                                oSuccess[i].results.unshift({ code: "", description: "" });
                                that.createLocalModel("insuranceCycleDurationModel", oSuccess[i].results);
                                break;
                            case 4:
                                oSuccess[i].results.unshift({ code: "", description: "" });
                                that.createLocalModel("insuranceCurrencyModel", oSuccess[i].results);
                                break;
                            case 5:
                                oSuccess[i].results.unshift({ code: "", description: "" });
                                that.createLocalModel("insuranceUOMModel", oSuccess[i].results);
                                break;
                            case 6:
                                console.log(oSuccess[i].results);
                                that.createLocalModel("itemTemplateModel", _.filter(oSuccess[i].results, { "Canceled": false }));
                                that.createLocalModel("insuranceTemplateTableModel", _.filter(oSuccess[i].results, { "Canceled": false }));
                                break;

                        }
                    }
                    that.getOwnerComponent().setModel(viewModel, "appMasterDataModel");
                    that.hideBusyIndicator();
                }, function (oError) {
                    that.hideBusyIndicator();
                });
            },
            _getInstituteList: function () {
                let that = this;
                return new Promise(function (fnResolve, fnReject) {
                    let _params = {

                    }
                    let _sPath = oController.isNewService ? "/OrganisationsValueHelp" : "/xSMYxI_HRP9080_ORG_VH";
                    _sPath = UIHelper.generateURL(_sPath, null, null, false, false, null, false, false);
                    var oModel = new sap.ui.model.odata.ODataModel(that.integrationUrl, true);
                    oModel.read(_sPath, null, null, null, function (oData, oResponse) {
                        fnResolve(oData);
                    }, function (oError) {
                        fnReject(oError);
                    });
                });
            },
            _callValueHelp: function (sPath, filters, expandEntities, isQuery, isTemplateOData) {
                var that = this;
                return new Promise(function (fnResolve, fnReject) {
                    let _filters = filters;
                    let _expandEntities = expandEntities;
                    let _sPath = "";
                    if (!isTemplateOData) {
                        if (isQuery) {
                            _sPath = UIHelper.generateURL(sPath, null, Object.keys(_filters).length > 0 ? _filters : null, false, false, _expandEntities,
                                _expandEntities.length > 0, false, false);
                        } else {
                            _sPath = UIHelper.generateURL(sPath, _filters, null, false, false, _expandEntities, _expandEntities.length > 0, false, false);
                        }
                    }
                    else {
                        if (isQuery) {
                            _sPath = UIHelper.generateURL(sPath, null, Object.keys(_filters).length > 0 ? _filters : null, false, false, _expandEntities,
                                _expandEntities.length > 0, false, true);
                        } else {
                            _sPath = UIHelper.generateURL(sPath, _filters, null, false, false, _expandEntities, _expandEntities.length > 0, false, false);
                        }
                    }

                    let _sURL = isTemplateOData ? that.integrationUrlTemplate : that.integrationUrl;
                    var oModel = new sap.ui.model.odata.ODataModel(_sURL, true);
                    oModel.read(_sPath, null, null, null, function (oData, oResponse) {
                        fnResolve(oData);
                    }, function (oError) {
                        fnReject(oError);
                    });
                });
            },
            _onUpdateRecordData: function (_headerObj, _updateObj, isItemUpdate, isNewVersion) {
                let that = this;
                if (!isItemUpdate) {
                    let _dataObject = _.cloneDeep(_updateObj);
                    oController.showBusyIndicator();
                    let _headerPlanObject = _.cloneDeep(_dataObject["to_PlanVers"][0]);
                    delete _headerPlanObject["to_PlanItem"];
                    Promise.all(
                        [
                            that._callUpdateOperation(_headerObj, _headerObj["__metadata"]["etag"], false),
                            that._callUpdateOperation(_headerPlanObject, _headerPlanObject["__metadata"]["etag"], false),
                            _.forEach(_.filter(_updateObj["to_PlanVers"][0]["to_PlanItem"].results, { "isNew": false }), function (_itemObj) {
                                let _itemLocalKeys = ["createdAt", "createdOn", "isEdit", "isModified", "isNew", "planItemsDetailConfiguration", "visibleRowCount", "to_PlanCopay", "to_PlanCoverage", "to_PlanIE", "to_PlanLimits"];
                                let _itemTempObj = _.cloneDeep(_itemObj);
                                _.forEach(_itemLocalKeys, function (_key) {
                                    delete _itemTempObj[_key];
                                });
                                let _coPayObj = _.cloneDeep(_itemObj)["to_PlanCopay"];
                                let _coverageObj = _.cloneDeep(_itemObj)["to_PlanCoverage"];
                                delete _coverageObj["CaseTypeText"];
                                delete _coverageObj["CritText"];


                                let _planLimitsObj = _.cloneDeep(_itemObj)["to_PlanLimits"];
                                delete _planLimitsObj["CycleDurTypeText"];

                                //let _planConfiguration = _.cloneDeep(_itemObj)[""]

                                that._callUpdateOperation(_itemTempObj, _itemTempObj["__metadata"]["etag"], false),
                                    that._callUpdateOperation(_coPayObj, _coPayObj["__metadata"]["etag"], false),
                                    that._callUpdateOperation(_coverageObj, _coverageObj["__metadata"]["etag"], false),
                                    that._callUpdateOperation(_planLimitsObj, _planLimitsObj["__metadata"]["etag"], false)

                            }),

                            _.forEach(_.filter(_updateObj["to_PlanVers"][0]["to_PlanItem"].results, { "isNew": true }), function (_itemObj) {
                                alert("Here");
                                let _itemLocalKeys = ["createdAt", "createdOn", "isEdit", "isModified", "isNew", "planItemsDetailConfiguration", "visibleRowCount", "to_PlanCopay", "to_PlanCoverage", "to_PlanIE", "to_PlanLimits"];
                                let _itemTempObj = _.cloneDeep(_itemObj);
                                _.forEach(_itemLocalKeys, function (_key) {
                                    delete _itemTempObj[_key];
                                });
                                let _coPayObj = _.cloneDeep(_itemObj)["to_PlanCopay"];
                                let _coverageObj = _.cloneDeep(_itemObj)["to_PlanCoverage"];
                                delete _coverageObj["CaseTypeText"];
                                delete _coverageObj["CritText"];


                                let _planLimitsObj = _.cloneDeep(_itemObj)["to_PlanLimits"];
                                delete _planLimitsObj["CycleDurTypeText"];

                                //let _planConfiguration = _.cloneDeep(_itemObj)[""]

                                that._addItem("/xSMYxC_PLAN", _headerObj, 'to_PlanItem', _itemTempObj, false)
                                // that._callUpdateOperation(_itemTempObj, _itemTempObj["__metadata"]["etag"], false),
                                //     that._callUpdateOperation(_coPayObj, _coPayObj["__metadata"]["etag"], false),
                                //     that._callUpdateOperation(_coverageObj, _coverageObj["__metadata"]["etag"], false),
                                //     that._callUpdateOperation(_planLimitsObj, _planLimitsObj["__metadata"]["etag"], false)

                            })
                        ]
                    ).then(function (oSuccess) {
                        that.hideBusyIndicator();
                        sap.m.MessageToast.show("Data Updated");
                        that._onCloseDetailView(false);
                        that._onLoadData();
                    }, function (oError) {
                    });
                }
                else {

                }
            },
            _onUpdateTemplateData: function (_updateObj) {
                let that = this;
                let oBundle = that.getView().getModel("i18n").getResourceBundle();
                //Update Header Object
                let _headerObj = _.cloneDeep(_updateObj);
                let _headerLocalKeys = ["createdAt", "createdBy", "isEdit", "isTemplateSelected", "templateDescription", "templateId"];
                _.forEach(_headerLocalKeys, function (_key) {
                    delete _headerObj[_key];
                });
                delete _headerObj["to_PlanTplCopay"];
                delete _headerObj["to_PlanTplCoverage"];
                delete _headerObj["to_PlanTplIE"];
                delete _headerObj["to_PlanTplLimits"];


                let _copayObject = _.cloneDeep(_updateObj)["to_PlanTplCopay"];
                let _coverageObject = _.cloneDeep(_updateObj)["to_PlanTplCoverage"];
                let _limitsObject = _.cloneDeep(_updateObj)["to_PlanTplLimits"];
                delete _coverageObject["CritText"];
                delete _coverageObject["CaseTypeText"];

                delete _limitsObject["CycleDurTypeText"];
                Promise.all(
                    [
                        that._callUpdateOperation(_headerObj, _headerObj["__metadata"]["etag"], true),
                        that._callUpdateOperation(_copayObject, _copayObject["__metadata"]["etag"], true),
                        that._callUpdateOperation(_coverageObject, _coverageObject["__metadata"]["etag"], true),
                        that._callUpdateOperation(_limitsObject, _limitsObject["__metadata"]["etag"], true),
                        _.forEach(_.filter(_updateObj["to_PlanTplIE"].results, { "isNew": false }), function (iEObj) {
                            delete iEObj["isNew"]
                            that._callUpdateOperation(iEObj, iEObj["__metadata"]["etag"], true)
                        }),
                        _.forEach(_.filter(_updateObj["to_PlanTplIE"].results, { "isNew": true }), function (iEObj) {
                            delete iEObj["isNew"]
                            that._addItem("/xSMYxC_PLAN_TPL", _headerObj, 'to_PlanTplIE', iEObj, true)
                        }),


                    ]
                ).then(function (oSuccess) {
                    that.hideBusyIndicator();
                    sap.m.MessageToast.show("Data Updated");
                    that._onCloseDetailView(true);
                    that._onLoadData();
                }, function (oError) {
                    oController.hideBusyIndicator();
                    if (JSON.parse(oError.response.body)) {
                        sap.m.MessageBox.show(JSON.parse(oError.response.body).error.message.value, {
                            title: oBundle.getText("lblError")
                        });
                        return;

                    }
                });
            },
            _onCreateRecordData: function (dataObject, isNewVersion) {
                let that = this;
                return new Promise(function (fnRResolve, fnReject) {
                    let _headerObj = {
                        "PlanId": dataObject["PlanId"],
                        "PlanDesc": dataObject["PlanDesc"],
                        "InsuranceBp": that.getView().getModel("insuranceDetailHeaderModel").getProperty("/insuranceNumber"),
                        "Org": DataHelper._getInstitute(),
                        // "IsActiveEntity": true
                    }
                    let _planVersion = [];
                    let _planItems = [];

                    _.forEach(dataObject.planItems, function (obj) {

                    });

                    _.forEach(dataObject.planDetails, function (obj) {

                    });
                    _planVersion.push({
                        "InsuranceBp": that.getView().getModel("insuranceDetailHeaderModel").getProperty("/insuranceNumber"),
                        "PlanFamily": _.has(dataObject, 'planDetails') ? dataObject.planDetails[0]["PlanFamily"] : false,
                        "PlanHdrLimit": _.has(dataObject, 'planDetails') ? dataObject.planDetails[0]["PlanHdrLimit"] : "",
                        "PlanHdrLimitCuky": _.has(dataObject, 'planDetails') ? dataObject.planDetails[0]["PlanHdrLimitCuky"] : "",
                        "PlanId": _.has(dataObject, 'planDetails') ? dataObject.planDetails[0]["PlanId"] : dataObject["PlanId"],
                        "PlanVersion": _.has(dataObject, 'planDetails') ? dataObject.planDetails[0]["PlanVersion"] : 1
                    });
                    _headerObj["to_PlanVers"] = _planVersion;
                    //
                    if (isNewVersion) {
                        _headerObj = _planVersion[0];
                        delete _headerObj["PlanVersion"];
                    }
                    let _sPath = isNewVersion ? "/xSMYxC_INS_PLAN(Org='" + dataObject.Org + "',PlanId='" + dataObject.PlanId + "')/to_PlanVers" : '/xSMYxC_INS_PLAN';

                    var oModel = new sap.ui.model.odata.ODataModel(that.integrationUrl, true);
                    oModel.create(_sPath, _headerObj, {
                        success: function (oData, oResponse) {
                            fnRResolve(oData);
                        },
                        error: function (oError) {
                            fnReject(oError);

                        }
                    });
                });
            },
            _callUpdateOperation: function (_dataObject, eTag, isTemplateObject) {
                let that = this;
                return new Promise(function (fnResolve, fnReject) {
                    let _sPath = _dataObject["__metadata"]["uri"].split("/")[_dataObject["__metadata"]["uri"].split("/").length - 1];
                    let _url = isTemplateObject ? that.integrationUrlTemplate : that.integrationUrl;
                    var oModel = new sap.ui.model.odata.ODataModel(_url, true);
                    oModel.setHeaders({
                        "etag": eTag,
                        "X-Requested-With": "XMLHttpRequest"
                    });
                    oModel.update(_sPath, _dataObject, {
                        context: null,
                        eTag: eTag,
                        success: function (oResponse) {
                            fnResolve(oResponse);
                        },
                        error: function (oError) {
                            fnReject(oError);
                        }
                    })
                });
            },
            _onDeleteRecord: function (_dataObject, eTag, isTemplateObject) {
                let that = this;
                return new Promise(function (fnResolve, fnReject) {
                    let _sPath = _dataObject["__metadata"]["uri"].split("/")[_dataObject["__metadata"]["uri"].split("/").length - 1];
                    let _sUrl = isTemplateObject ? that.integrationUrlTemplate : that.integrationUrl;
                    var oModel = new sap.ui.model.odata.ODataModel(_sUrl, true);
                    oModel.remove(_sPath, {
                        success: function (oResponse) {
                            fnResolve(oResponse);
                        },
                        error: function (oError) {
                            fnReject(oError);
                        }
                    })
                });
            },
            _addItem: function (colllection, parentObj, property, itemObj, isTemplate) {
                let that = this;
                return new Promise(function (fnResolve, fnReject) {
                    let _sPath = colllection;
                    let _url = isTemplate ? that.integrationUrlTemplate : that.integrationUrl;
                    if (isTemplate) {
                        _sPath = parentObj["__metadata"]["uri"].split("/")[parentObj["__metadata"]["uri"].split("/").length - 1];
                        _sPath = _sPath + "/" + property
                    }
                    else {
                        _sPath = parentObj["__metadata"]["uri"].split("/")[parentObj["__metadata"]["uri"].split("/").length - 1];
                        _sPath = _sPath + "/" + property
                    }

                    var oModel = new sap.ui.model.odata.ODataModel(_url, true);
                    oModel.setHeaders({
                        "X-Requested-With": "XMLHttpRequest"
                    });
                    oModel.create(_sPath, itemObj, {
                        success: function (oResponse) {
                            fnResolve(oResponse);
                        },
                        error: function (oError) {
                            fnReject(oError);
                        }
                    })
                });
            },
            _onCallFunctionImport: function (functionName, params, isPost, isTemplateObject) {
                let that = this;
                that.showBusyIndicator();
                return new Promise(function (fnResolve, fnReject) {
                    let _url = isTemplateObject ? that.integrationUrlTemplate : that.integrationUrl;
                    var oModel = new sap.ui.model.odata.ODataModel(_url, true);
                    oModel.callFunction(functionName, {
                        method: isPost ? "POST" : "GET",
                        urlParameters: params,
                        success: function (oResult) {
                            oController.hideBusyIndicator();
                            fnResolve(oResult)
                        },
                        error: function (oError) {
                            oController.hideBusyIndicator();
                            fnReject(oError)
                        }
                    })
                });
            }
        });
    });
