jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.declare("zninsurancecre.util.UIHelper");
jQuery.sap.require("zninsurancecre.controls.SecondaryMultiComboBox");

zninsurancecre.util.UIHelper = (function () {
	var _cntrlrInst = null;
	var _isChangeAction = false;
	return {
		getConstants: function (variable) {
			switch (variable) {
				case "language2": //1 Character language
					let _language2 = sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase();
					return _language2;
					break;
				case 'dateFormat':
					let _userDateFormat = sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("medium");
					return _userDateFormat && _userDateFormat !== undefined && _userDateFormat !== "" ? _userDateFormat.toUpperCase() : 'YYYY.MM.DD';
					break;
			}
		},
		_checkSingleByte: function (string) {
			let _byteLen = 0;
			let _isDoubleBytePresent = false;
			for (let i = 0; i < string.length; i++) {
				let c = string.charCodeAt(i);
				let _lengthByte = c < (1 << 7) ? 1 : c < (1 << 11) ? 2 : c < (1 << 16) ? 3 : c < (1 << 21) ? 4 : c < (1 << 26) ? 5 : c < (1 << 31) ?
					6 : NaN;
				if (_lengthByte > 1) {
					_isDoubleBytePresent = true;
				}
			}
			return _isDoubleBytePresent;
		},
		_getDateFromNumber: function (_numericRepresentation) {
			var utc_days = Math.floor(_numericRepresentation - 25569);
			var utc_value = utc_days * 86400;
			var date_info = new Date(utc_value * 1000);

			var fractional_day = _numericRepresentation - Math.floor(_numericRepresentation) + 0.0000001;

			var total_seconds = Math.floor(86400 * fractional_day);

			var seconds = total_seconds % 60;

			total_seconds -= seconds;

			var hours = Math.floor(total_seconds / (60 * 60));
			var minutes = Math.floor(total_seconds / 60) % 60;

			return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
		},
		_isFileNameValid: function (fileName) {
			let isValid = true;
			let _fileNameLength = fileName.length;
			let _allowedLength = 100;
			if (this.getConstants("language2") === 'JA') {
				isValid = _fileNameLength <= Math.round(_allowedLength / 2) ? true : false;
			} else {
				isValid = _fileNameLength <= _allowedLength ? true : false;
			}
			return isValid;
		},
		_isFileSpecialCharacters: function (fileName) {
			//return !/[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(fileName);	
			return !/[~`!@#$%\^&*+=\[\]\\';,/{}|\\":<>\?]/g.test(fileName);
		},
		setControllerInstance: function (oControllerInst) {
			_cntrlrInst = oControllerInst;
		},
		getControllerInstance: function () {
			return _cntrlrInst;
		},
		setIsChangeAction: function (oStatus) {
			_isChangeAction = oStatus;
		},
		getIsChangeAction: function () {
			return _isChangeAction;
		},
		isJSONString: function (str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		isValidUrl: function (_string) {
			let _urlString;
			try {
				_urlString = new URL(_string);
			} catch (_) {
				return false;
			}
			return _urlString.protocol === "file:";
		},
		getChunks: function (str, size) {
			const numChunks = Math.ceil(str.length / size)
			const chunks = new Array(numChunks)

			for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
				chunks[i] = str.substr(o, size)
			}

			return chunks
		},
		padWithZeros: function (str, length) {
			var my_string = '' + str;
			while (my_string.length < length) {
				my_string = '0' + my_string;
			}
			return my_string;
		},
		getDataInViewType: function (length, isMultiple) {
			switch (length) {
				case 0:
					return 'Input';
					break;
				case 1:
					if (isMultiple) {
						return 'MultiSelect';
						break;
					} else {
						return 'Select';
						break;
					}
				// return 'Select';
				// break;
				case 2:
					if (isMultiple) {
						return 'MultiSelect';
						break;
					} else {
						return 'Select';
						break;
					}
				default:
					if (isMultiple) {
						return 'MultiSelect';
						break;
					} else {
						return 'Select';
						break;
					}
			}
		},
		getRequestType: function (isNewArticle, isPriceUpdate, isImageUpdate, isDeliveryDateUpdate) {
			let _requestType = '1';
			if (isNewArticle && !isPriceUpdate && !isImageUpdate && !isDeliveryDateUpdate) {
				_requestType = '1'; //New Article
			} else if (!isNewArticle && isPriceUpdate && !isImageUpdate && !isDeliveryDateUpdate) {
				_requestType = '2'; // Price Update
			} else if (!isNewArticle && isPriceUpdate && isImageUpdate && !isDeliveryDateUpdate) {
				_requestType = '3'; // Image Update
			} else if (!isNewArticle && !isPriceUpdate && !isImageUpdate && isDeliveryDateUpdate) {
				_requestType = '5'; // Delivery Date Update
			}
			return _requestType;
		},
		getDataInWhichPanel: function (key) {
			let _key = key.toString().toLowerCase();
			if (_key.indexOf("allergen") !== -1) {
				return "Allergen Details";
			} else if (_key.indexOf("stock") !== -1) {
				return "Stock Information";
			} else if (_key.indexOf("origin") !== -1) {
				return "Origin";
			} else {
				return "Basic Details"
			}
		},
		errorDialog: function (messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message: messages,
					type: sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for (var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					_errorTxt.trim();
					if (_errorTxt !== "") {
						if (i === 0) {
							_firstMsgTxtLine = _errorTxt;
						} else {
							_detailmsg = _detailmsg + _errorTxt + "\n";
						}
					}
				}

				if (_detailmsg == "") { // do not show any details if none are there
					oSettings = {
						message: _firstMsgTxtLine,
						type: sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message: _firstMsgTxtLine,
						details: _detailmsg,
						type: sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		},
		ignoreKeys: function () {
			return ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
		},
		_validateKeyCode: function (keyCode) {
			if (keyCode >= 48 && keyCode <= 90) {
				return true;
			} else {
				return false;
			}
		},
		keyValuePairs: function (object) {
			var array = [];
			for (var key in object) {
				if (this.ignoreKeys().indexOf(key) < 0) {
					var value = object[key],
						float = parseFloat(value);

					array.push({
						key: key,
						value: value || ''
					});
				}
			}
			return array;
		},
		generateURLMultiSearch: function (collection, array, paramKey, expandEntities, isExpand) {
			let url = collection;
			if (array.length > 0) {
				url += '?$filter=';
				array.forEach(function (filter, index) {
					if (index > 0) {
						url += encodeURIComponent(' or ');
					}
					url += paramKey + encodeURIComponent(" eq '" + array[index]) + "'";
				});
			}
			if (isExpand) {
				url += '&$expand=';
				let _expandedEntities = expandEntities.toString();
				url += _expandedEntities;
			}
			return url;
		},
		generateURL: function (collection, params, filters, isPost, isDateAlso, expandEntities, isExpand, isValue, isReadOperation) {
			let url = collection;
			if (!isPost && params) params = this.keyValuePairs(params);
			if (!isPost && filters) filters = this.keyValuePairs(filters);
			if (!isPost && params) {
				url += '(';
				params.forEach(function (param, index) {
					if (index > 0) {
						url += ',';
					}
					if (param.key.indexOf('Time') != -1) {
						if (isDateAlso) {
							url += param.key + "=datetime'" + encodeURIComponent(param.value) + "'";
						} else {
							url += param.key + "='" + encodeURIComponent(param.value) + "'";
						}
					} else {
						url += param.key + "='" + encodeURIComponent(param.value) + "'";
					}
				});
				url += ')';
			}
			if (!isPost && filters) {
				url += '?$filter=';
				filters.forEach(function (filter, index) {
					if (index > 0) {
						url += encodeURIComponent(' and ');
					}
					if (filter.key.indexOf('date') != -1) {
						if (isDateAlso) {
							url += filter.key + encodeURIComponent(" eq datetime'" + filter.value) + "'";
						} else {
							url += filter.key + encodeURIComponent(" eq '" + filter.value) + "'";
						}
					} else {
						url += filter.key + encodeURIComponent(" eq '" + filter.value) + "'";
					}

				});
			}
			if (isExpand) {
				url += isReadOperation ? '?$expand=' : '&$expand=';
				let _expandedEntities = expandEntities.toString();
				url += _expandedEntities;
			}
			if (isValue) {
				url += '/$value';
			}
			return url;
		},
		_generateFormElement: function (templateType, templateData, modelKeyName, fieldDescription, isDisplay, isRequired, inputType,
			inputLength) {
			let that = this;
			let _formElement = new sap.ui.layout.form.FormElement({
				label: new sap.m.Label({
					text: fieldDescription,
					design: "Standard",
					width: "100%",
					required: isRequired,
					textAlign: "Begin",
					textDirection: "Inherit",
					visible: true,
					wrapping: true
				}).addStyleClass("blackLabel")
			});
			switch (templateType) {
				case "MultiSelect":
					let multiSelectModel = new sap.ui.model.json.JSONModel();
					multiSelectModel.setData(templateData);
					multiSelectModel.setSizeLimit(templateData.length);
					let _oMultiSelect = new ZN_ISH_BILLING.controls.SecondaryMultiComboBox({
						selectedKeys: "{createCatalogItemModel>/" + modelKeyName + "}",
						enabled: "{createCatalogItemModel>/" + modelKeyName + "enabled}",
					});
					var _oMultiItemTemplate = new sap.ui.core.ListItem({
						key: "{code}",
						text: "{description}",
						additionalText: "{code}",
					});

					_oMultiSelect.setModel(multiSelectModel);
					_oMultiSelect.bindAggregation("items", "/", _oMultiItemTemplate);
					_formElement.addField(_oMultiSelect);
					break;
				case "Select":
					//_formElement.addField(oField)
					let model = new sap.ui.model.json.JSONModel();
					//For Non Food Allergens

					_.forEach(templateData, function (_data) {
						_data.isItemEnabled = !_data.isOnlyNonFood;
					});

					model.setData(templateData);
					model.setSizeLimit(templateData.length);

					let _oSelect = new sap.m.Select({
						forceSelection: false,
						//enabled: !isDisplay,
						showSecondaryValues: true,
						//enabled: "{createCatalogItemModel>/isNewArticle}",
						enabled: "{createCatalogItemModel>/" + modelKeyName + "enabled}",
						selectedKey: "{createCatalogItemModel>/" + modelKeyName + "}",
					});
					var _oItemTemplate = new sap.ui.core.ListItem({
						key: "{code}",
						text: "{description}",
						additionalText: "{code}",
						enabled: "{isItemEnabled}" //For Non Food Allergens
					});

					_oSelect.setModel(model);
					_oSelect.bindAggregation("items", "/", _oItemTemplate);
					_oSelect.addStyleClass("customSelectClass");
					_formElement.addField(_oSelect);
					break;
				case "Input":
					let _oInput = new sap.m.Input({
						value: "{createCatalogItemModel>/" + modelKeyName + "}",
						type: inputType,
						//editable: "{createCatalogItemModel>/isNewArticle}",
						editable: "{createCatalogItemModel>/" + modelKeyName + "enabled}",

						//editable: !isDisplay
					});
					inputLength = that.getConstants("language2") === 'JA' ? Math.round(inputLength / 2) : inputLength;
					_oInput.setMaxLength(inputLength);
					if (inputType === 'Number') {
						_oInput.attachBrowserEvent("keypress", function (oEvent) {
							let _charCode = (oEvent.which) ? oEvent.which : oEvent.keyCode;
							if (_charCode != 46 && _charCode > 31 && (_charCode < 48 || _charCode > 57)) {
								oEvent.preventDefault();
							}
						});
					}
					_formElement.addField(_oInput);
					break;
				case "Checkbox":
					let _oCheckBox = new sap.m.CheckBox({
						selected: "{createCatalogItemModel>/" + modelKeyName + "}",
						//editable: !isDisplay
						editable: "{createCatalogItemModel>/isNewArticle}"
					});
					_formElement.addField(_oCheckBox);
					break;
			}
			return _formElement;
		},
		_createUpdateObject: function (entitySet, _headerData, isUrl, isDeleteOperation) {
			let _obj = {};
			switch (entitySet) {
				case 'xSMYxC_PLAN':
					_obj = _headerData;
					delete _obj["SiblingEntity"];
					delete _obj["to_Insurance"];
					delete _obj["to_PlanVers"];
					delete _obj["DraftAdministrativeData"];
					break;
			}
			return _obj;
		},
		_createJSONObject: function (entitySet, _headerData, itemData, attributesData, dcData, attachmentData, branchData, siteData,
			standardCosts) {
			let obj = {};
			switch (entitySet) {
				case "xSMYxC_LYT_VAR_DEF":
					obj.LayVariant = _headerData.variantTitle;
					obj.ServRefId = _headerData.serviceReferenceId;
					obj.LayVarDes = _headerData.variantDescription;
					let _variantAssignment = [];
					_.forEach(itemData, function (item) {
						_variantAssignment.push({
							"ColumnId": item.columnId,
							"Sequence": item.columnSequence
						})
					});
					obj.to_LytVarAssgn = _variantAssignment;
					break;
				case "A_VDM_HDRSet":
					obj.Bukrs = _headerData.companyCode;
					obj.ItemsS = _headerData.totalItems;
					obj.Land1 = _headerData.country;
					obj.Lifnr = _headerData.supplierCode;
					obj.Ekorg = _headerData.purchasingOrg;
					obj.CatalogueName = _headerData.catalogName;
					obj.CatalogueText = _headerData.catalogDescription;
					obj.PLifnr = _headerData.vendorCode;
					obj.Currency = _headerData.currencyKey;
					obj.ZcataType = itemData[0].requestType;
					obj.Region = _headerData.regionCode;

					let _itemData = [];
					let _attributesData = [];
					let _attachmentData = [];
					let _branchData = [];
					let _siteData = [];
					let _standardCosts = [];

					_.forEach(itemData, function (item) {
						_itemData.push({
							"ZcatalogueItm": item.itemNo,
							"Matnr": item.articleCode,
							"Maktx": item.articleDescription,
							"Mtart": item.articleType,
							"Matkl": item.merchandiseCategory,
							//"Bismt": item.articleCode,
							"Meins": item.baseUOM,
							"Bstme": item.orderingUnit,
							"Umrez": item.conversionFactor !== undefined ? item.conversionFactor.toString() !== "" && item.conversionFactor !== undefined ?
								item.conversionFactor : "0" : "0",
							"Raube": item.storageCondition,
							"Tempb": item.temperatureCondition,
							"Mhdrz": item.shelfLife !== undefined ? item.shelfLife !== "" && item.shelfLife !== undefined ? item.shelfLife : "0" : "0",
							"Minbm": item.minimumQuantity,
							"ManfrName": item.manufacturerName ? item.manufacturerName.trim() : "",
							"Mfrnr": item.manufacturerVendorCode,
							"Idnlf": item.manufacturerProductCode,
							"Datab": item.validFrom,
							"Datbi": item.validTo,
							"Kbetr": item.offVendorPrice.toString(),
							"Mwskz": item.taxPercentage,
							"Priceunit": Number(item.contractPrice).toString(),
							"WwghaL1": item.level1Code,
							"WwghbL1": item.level1Description,
							"WwghaL2": item.level2Code,
							"WwghbL2": item.level2Description,
							"WwghaL3": item.level3Code,
							"WwghbL3": item.level3Description,
							"WwghaL4": item.level4Code,
							"WwghbL4": item.level4Description,
							"WwghaL5": item.level5Code,
							"WwghbL5": item.level5Description,
							"WwghaL6": item.level6Code,
							"WwghbL6": item.level6Description,
							"isStandardCostFlag": item.isStandardCostFlag,
							"Ekgrp": item.purchasingGroup
						});
					});
					_.forEach(attributesData, function (attribute) {
						if (attribute.attributeValue !== undefined) {
							_attributesData.push({
								"ZcatalogueItm": attribute.itemNo,
								"Atnam": attribute.attributeKey,
								"Atwrt": _.isBoolean(attribute.attributeValue) ? attribute.attributeValue ? 'X' : '' : attribute.attributeValue.toString(),
								"Atfor": attribute.attributeDataType
							});
						}

					});
					_.forEach(attachmentData, function (attachment) {
						_attachmentData.push({
							"ZcatalogueItm": attachment.itemNo,
							"ZdocType": "", //attachment.fileType,
							"ZfileData": attachment.fileData,
							"Zftitle": attachment.fileName,
							"ZfileName": attachment.fileName,
							"ZfileExt": attachment.fileExtension
						})
					});
					_.forEach(branchData, function (branch) {
						_branchData.push({
							"ZcatalogueItm": branch.itemNo,
							"Lifnr": branch.branchCode,
							"MainVend": branch.isMainVendor ? 'X' : ''
						});
					});
					_.forEach(siteData, function (site) {
						_siteData.push({
							"itemNo": site.itemNo,
							"sites": site.siteCode,
							"articleCode": site.articleCode,
							"sitesDelete": site.sitesDelete
						});
					});
					_.forEach(standardCosts, function (standardCost) {
						_standardCosts.push({
							"itemNo": standardCost.itemNo,
							"regionCode": standardCost.regionCode,
							"subRegionCode": standardCost.subRegionCode,
							"sector": standardCost.sector,
							"standardCost": standardCost.standardCost,
							"articleCode": standardCost.articleCode,
							"siteCodeSC": standardCost.siteCodeSC,
							"isCreate": standardCost.isCreate,
							"sitesDelete": standardCost.sitesDelete
						});
					});
					obj.ARTICLE_ITEM = _itemData;
					obj.ARTICLE_ATTR = _attributesData;
					obj.ARTICLE_ATTACH = _attachmentData;
					obj.ARTICLE_VENDOR = _branchData;
					obj.ARTICLE_SITES = _siteData;
					obj.ARTICLE_SC = _standardCosts;
					break;
				case "requestDraft":
					obj.companyCode = _headerData.companyCode;
					obj.totalItems = _headerData.totalItems;
					obj.country = _headerData.country;
					obj.vendorCode = _headerData.supplierCode;
					obj.purchasingOrg = _headerData.purchasingOrg;
					obj.catalogName = _headerData.catalogName;
					obj.catalogDescription = _headerData.catalogDescription;
					obj.parentvendor = _headerData.vendorCode;
					obj.currencyKey = _headerData.currencyKey;
					obj.radioSelection = _headerData.radioSelection;
					obj.regionCode = _headerData.regionCode;

					let _itemDataDraft = [];
					let _attributesDataDraft = [];
					let _attachmentDataDraft = [];
					let _branchDataDraft = [];
					let _siteDataDraft = [];
					let _standardCostsDraft = [];

					_.forEach(itemData, function (item) {
						_itemDataDraft.push({
							"itemNo": item.itemNo,
							"articleCode": item.articleCode,
							"articleDescription": item.articleDescription,
							"articleType": item.articleType,
							"merchandiseCategory": item.merchandiseCategory,
							//"Bismt": item.articleCode,
							"baseUOM": item.baseUOM,
							"orderingUnit": item.orderingUnit,
							"conversionFactor": item.conversionFactor !== undefined ? item.conversionFactor.toString() !== "" && item.conversionFactor !==
								undefined ?
								item.conversionFactor : "0" : "0",
							"storageCondition": item.storageCondition,
							"temperatureCondition": item.temperatureCondition,
							"shelfLife": item.shelfLife,
							"minimumQuantity": item.minimumQuantity,
							"manufacturerName": item.manufacturerName ? item.manufacturerName.trim() : "",
							"manufacturerVendorCode": item.manufacturerVendorCode,
							"manufacturerProductCode": item.manufacturerProductCode,
							"validFrom": item.validFrom,
							"validTo": item.validTo,
							"offVendorPrice": item.offVendorPrice,
							"taxPercentage": item.taxPercentage,
							"contractPrice": Number(item.contractPrice).toString(),
							"level1Code": item.level1Code,
							"level1Description": item.level1Description,
							"level2Code": item.level2Code,
							"level2Description": item.level2Description,
							"level3Code": item.level3Code,
							"level3Description": item.level3Description,
							"level4Code": item.level4Code,
							"level4Description": item.level4Description,
							"level5Code": item.level5Code,
							"level5Description": item.level5Description,
							"level6Code": item.level6Code,
							"level6Description": item.level6Description,
							"requestType": item.requestType,
							"isPriceUpdate": item.isPriceUpdate,
							"isImageUpdate": item.isImageUpdate,
							"isStandardCostFlag": item.isStandardCostFlag,
							"purchasingGroup": item.purchasingGroup,
							"defaultSites": item.defaultSites,
							"articleSites": item.articleSites,
							"blockedSites": item.blockedSites,
							"siteCode": item.siteCode,
							"isStandardCostAllowed": item.isStandardCostAllowed,
							"isStandardCostVisible": item.isStandardCostVisible,
							"standardCost": item.standardCost,
							"standardCostLog": item.standardCostLog,
							"isStandardCostChange": item.isStandardCostChange,
							"isStandardCostFlag": item.isStandardCostFlag
						});
					});
					_.forEach(attributesData, function (attribute) {
						if (attribute.attributeValue !== undefined) {
							_attributesDataDraft.push({
								"itemNo": attribute.itemNo,
								"attributeKey": attribute.attributeKey,
								"attributeValue": _.isBoolean(attribute.attributeValue) ? attribute.attributeValue ? 'X' : '' : attribute.attributeValue.toString(),
								"attributeDataType": attribute.attributeDataType
							});
						}

					});
					_.forEach(attachmentData, function (attachment) {
						_attachmentDataDraft.push({
							"itemNo": attachment.itemNo,
							"fileType": "", //attachment.fileType,
							"fileData": attachment.fileData,
							"fileName": attachment.fileName,
							"fileName": attachment.fileName,
							"fileExtension": attachment.fileExtension,
							"isAttachmentId": attachment.isAttachmentId,
							"actualFileName": attachment.actualFileName
						})
					});
					_.forEach(branchData, function (branch) {
						_branchDataDraft.push({
							"itemNo": branch.itemNo,
							"branchCode": branch.branchCode
						});
					});
					_.forEach(siteData, function (site) {
						_siteDataDraft.push({
							"itemNo": site.itemNo,
							"siteCode": site.siteCode,
							"articleCode": site.articleCode,
							"sitesDelete": site.sitesDelete
						});
					});
					_.forEach(standardCosts, function (standardCost) {
						_standardCostsDraft.push({
							"itemNo": standardCost.itemNo,
							"regionCode": standardCost.regionCode,
							"subRegionCode": standardCost.subRegionCode,
							"sector": standardCost.sector,
							"standardCost": standardCost.standardCost,
							"articleCode": standardCost.articleCode,
							"siteCodeSC": standardCost.siteCodeSC,
							"isCreate": standardCost.isCreate,
							"sitesDelete": standardCost.sitesDelete
						});
					});
					obj.catalogItems = _itemDataDraft;
					obj.catalogAttributes = _attributesDataDraft;
					obj.catalogAttachments = _attachmentDataDraft;
					obj.catalogBranch = _branchDataDraft;
					obj.catalogSites = _siteDataDraft;
					obj.catalogStandardCost = _standardCostsDraft;
					break;
				case "backgroundReport":
					obj.inputDDflag = _headerData.inputDDflag;
					obj.inputL3Code = _headerData.inputL3Code;
					obj.inputL4Code = _headerData.inputL4Code;
					obj.inputNoOfDays = _headerData.inputNoOfDays;
					obj.inputReportType = _headerData.inputReportType;
					obj.inputSupplierCode = _headerData.inputSupplierCode;
					obj.inputZDVendor = _headerData.inputZDVendor;
					let _dataFields = [];
					_.forEach(itemData, function (item) {
						delete item['isText'];
						_dataFields.push(item);
					});
					obj.dataFields = _dataFields;
					break;
				case "vendorAcknowledgement":
					obj.catalogId = _headerData.catalogId;
					obj.vendorCode = _headerData.vendorCode;
					obj.workItemId = _headerData.workItemId;
					obj.action = _headerData.action;
					obj.comments = _headerData.comments;

					break;
			}
			return obj;
		}
	};
}());