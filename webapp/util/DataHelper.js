jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.declare("zninsurancecre.util.DataHelper");

zninsurancecre.util.DataHelper = (function () {
	vendorId = null;
	instituteId = null;
	isAdmin = false;
	return {
		_getPropertyMapping: function (_type) {
			switch (_type) {
				case "patientDetails":
					let _arr = [
						{
							"fieldId": "patientId",
							"backendId": "PatientId"
						}
					];
					return _arr;
					break;
			}
		},
		_getFileMime: function (fileName) {
			let _fileArray = fileName.split(".");
			let _extension = _fileArray[_fileArray.length - 1];
			_extension = _extension.toLowerCase();
			switch (_extension) {
				case "aac":
					return "audio/aac";
					break;
				case "bin":
					return "application/octet-stream";
					break;
				case "bmp":
					return "image/bmp";
					break;
				case "csv":
					return "text/csv";
					break;
				case "doc":
					return "application/msword";
					break;
				case "docx":
					return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case "gif":
					return "image/gif";
					break;
				case "jpeg":
				case "jpg":
					return "image/jpeg";
					break;
				case "png":
					return "image/png";
					break;
				case "pdf":
					return "application/pdf";
					break;
				case "ppt":
					return "application/vnd.ms-powerpoint";
					break;
				case "pptx":
					return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
					break;
				case "rtf":
					return "application/rtf";
					break;
				case "svg":
					return "image/svg+xml";
					break;
				case "tif":
				case "tiff":
					return "image/tiff";
					break;
				case "txt":
					return "text/plain";
					break;
				case "webp":
					return "image/webp";
					break;
				case "xls":
					return "application/vnd.ms-excel";
					break;
				case "xlsx":
					return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
			}
		},
		_getAllowedMimeTypes: function () {
			let _allowedMimeTypes = [];
			_allowedMimeTypes.push("image/png");
			_allowedMimeTypes.push("image/jpeg");
			_allowedMimeTypes.push("image/jpg");
			_allowedMimeTypes.push("image/bmp");
			_allowedMimeTypes.push("image/gif");
			_allowedMimeTypes.push("image/svg+xml");
			_allowedMimeTypes.push("image/tiff");
			_allowedMimeTypes.push("application/pdf");
			return _allowedMimeTypes;
		},
		_getTabSequences: function (isNewArticle, isImageUpdate) {
			let _iconTab = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false,
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "PRICING",
				"name": "Pricing",
				"isLast": false,
				"isBoth": true,
				"isAltLast": true
			}, {
				"sequence": 3,
				"altSequence": 9,
				"key": "ATTRIBUTES",
				"name": "Attributes",
				"isLast": false,
				"isBoth": false,
				"isAltLast": false
			}, {
				"sequence": 4,
				"altSequence": 3,
				"key": "ATTACHMENTS",
				"name": "Attachments",
				"isLast": true,
				"isBoth": false,
				"isAltLast": false
			}];

			let _iconTabImage = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false,
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "ATTACHMENTS",
				"name": "Attachments",
				"isLast": true,
				"isBoth": true,
				"isAltLast": true
			}];

			// return !isNewArticle ? _.filter(_iconTab, {
			// 	"isBoth": true
			// }) : _iconTab;
			if (!isNewArticle && isImageUpdate) {
				_iconTab = _iconTabImage;
			}
			return !isNewArticle && !isImageUpdate ? _.filter(_iconTab, {
				"isBoth": true
			}) : !isNewArticle && isImageUpdate ? _.filter(_iconTab, {
				"isBoth": true
			}) : _iconTab;
		},
		_getTabSequencesDisplay: function (isNewArticle, showAttachment, showPricing, isVendorAcknowledge) {
			let _iconTab = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "PRICING",
				"name": "Pricing",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 3,
				"altSequence": 9,
				"key": "ATTRIBUTES",
				"name": "Attributes",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 4,
				"altSequence": 3,
				"key": "ATTACHMENTS",
				"name": "Attachments",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 5,
				"altSequence": 4,
				"key": "LOG",
				"name": "Log",
				"isLast": true,
				"isBoth": true,
				"isAltLast": true
			},];

			let _iconTabPricing = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "PRICING",
				"name": "Pricing",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 3,
				"altSequence": 3,
				"key": "LOG",
				"name": "Log",
				"isLast": true,
				"isBoth": true,
				"isAltLast": true
			},];
			let _iconTabPricingVendor = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "PRICING",
				"name": "Pricing",
				"isLast": true,
				"isBoth": true,
				"isAltLast": true
			}];
			let _iconTabImage = [{
				"sequence": 1,
				"altSequence": 1,
				"key": "GENERAL",
				"name": "General Tab",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false,
			}, {
				"sequence": 2,
				"altSequence": 2,
				"key": "ATTACHMENTS",
				"name": "Attachments",
				"isLast": false,
				"isBoth": true,
				"isAltLast": false
			}, {
				"sequence": 3,
				"altSequence": 3,
				"key": "LOG",
				"name": "Log",
				"isLast": true,
				"isBoth": true,
				"isAltLast": true
			}];

			// return !isNewArticle ? _.filter(_iconTab, {
			// 	"isBoth": true
			// }) : _iconTab;

			if (!isNewArticle && showAttachment && !showPricing) {
				_iconTab = _iconTabImage;
			}
			if (!isNewArticle && showPricing && !showAttachment) {
				_iconTab = isVendorAcknowledge ? _iconTabPricingVendor : _iconTabPricingVendor;
			}
			return !isNewArticle ? _.filter(_iconTab, {
				"isBoth": true
			}) : _iconTab;

		},
		_getStatusText: function (statusCode, i18nModel) {
			switch (statusCode) {
				case "R":
					return i18nModel.getResourceBundle().getText("lblStatusRejected"); //"Rejected";
					break;
				case "A":
					return i18nModel.getResourceBundle().getText("lblStatusApproved"); //"Approved";
					break;
				case "P":
					return i18nModel.getResourceBundle().getText("lblStatusPartiallyApproved"); //"Partially Approved";
					break;
				case "C":
					return i18nModel.getResourceBundle().getText("lblStatusCompleted"); //"Completed";
					break;
				case "U":
					return i18nModel.getResourceBundle().getText("lblStatusUpdated"); //"Updated";
					break;
				case "S":
					return i18nModel.getResourceBundle().getText("lblStatusSubmitted"); //"Submitted";
					break;
				case "I":
					return i18nModel.getResourceBundle().getText("lblStatusInProcess"); //"In Process";
					break;
				case "E":
					return i18nModel.getResourceBundle().getText("lblStatusError"); //"Error";
					break;
			}
		},
		_getChartSettingsObject: function (_analyticType, _cardType, _cardTitle, _chartType, _isTitleVisible, _measureAxis, _dimensionAxis,
			dimensionLabel, dimensionProperty, measureLabel, measureProperty, _listTime, _listDescription, _listTitle, _listIcon) {
			let _settingsObject = {
				"_analyticType": _analyticType,
				"_cardType": _cardType,
				"_cardTitle": _cardTitle,
				"_chartType": _chartType,
				"_isTitleVisible": _isTitleVisible,
				"_measureAxis": _measureAxis,
				"_dimensionAxis": _dimensionAxis,
				"dimensionLabel": dimensionLabel,
				"dimensionProperty": "{" + dimensionProperty + "}",
				"measureLabel": measureLabel,
				"measureProperty": "{" + measureProperty + "}",
				"_listTime": "{" + _listTime + "}",
				"_listDescription": "{" + _listDescription + "}",
				"_listTitle": "{" + _listTitle + "}",
				"_listIcon": "{" + _listIcon + "}",
			};
			return _settingsObject;
		},
		cleanUpBlankEntries: function (_data, excelType, i18nModel) {
			let that = this;
			_.forEach(_data, function (dataObj, idx) {
				dataObj.serialNo = idx;
				dataObj.isRemove = _.values(dataObj).every(_.isEmpty);
				if (excelType === 1) {
					if (sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase().substr(0, 1) === 'E') {
						if (!_.has(dataObj, i18nModel.getResourceBundle().getText("lblCompassArticleDescription"))) {
							dataObj.isRemove = true;
						}
					} else {
						if (!_.has(dataObj, i18nModel.getResourceBundle().getText("lblCompassArticleDescription"))) {
							dataObj.isRemove = true;
						}
					}
				}
				else if (excelType === 6) {
					debugger;
				}
			});
			return _.remove(_data, {
				'isRemove': false
			});
		},
		extractExcelData: function (_file, isMassUpdate) {
			let excelData = {};
			if (_file && window.FileReader) {
				return new Promise(function (fnResolve, fnReject) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						workbook.SheetNames.forEach(function (sheetName) {
							// Here is your object for every sheet in workbook
							if (isMassUpdate) {
								if (sheetName === 'Template') {
									excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

								}
							} else {
								if (sheetName === 'Template') {
									excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
								}

							}

						});
						fnResolve(excelData);
					};
					reader.onerror = function (ex) {
						fnReject(ex);
					};
					reader.readAsBinaryString(_file);
				});

			}
		},
		extractImage: function (_file, dataObj) {
			if (_file && window.FileReader) {
				return new Promise(function (fnResolve, fnReject) {
					var _url = new URL(_file);
					var reader = new FileReader();
					reader.readAsDataURL(_url.href);
					reader.readAsBinaryString(_url.href);
					reader.onload = function (e) {
						fnResolve(e.result);
					};
					reader.onerror = function (ex) {
						debugger;
						fnReject(ex);
					};

					// var request = new XMLHttpRequest();
					// request.open('GET', _url.href, true);
					// request.responseType = 'blob';
					// request.onload = function() {
					// 	var reader = new FileReader();
					// 	reader.readAsDataURL(request.response);
					// 	reader.onload = function(e) {
					// 		fnResolve(e.result);
					// 	};
					// 	reader.onerror = function(ex) {
					// 		debugger;
					// 		fnReject(ex);
					// 	};
					// };
					// request.send();
				});

			}
		},
		_generateAnalyticalManifest: function (_chartSettings, _legendSettings, _plotSettings, data) {
			let _analyticObject = {};
			let _finalObject = {};
			switch (_chartSettings["_analyticType"]) {
				case "donut":
					let _sapAppObj = {
						"id": _chartSettings["_cardType"] + "ID",
						"type": _chartSettings["_cardType"]
					};
					let _sapCardObj = {
						"type": "Analytical",
						"header": {
							"title": _chartSettings["_cardTitle"]
						},
						"content": {
							"chartType": _chartSettings["_chartType"],
							"legend": _legendSettings,
							"plotArea": _plotSettings,
							"title": {
								"visible": _chartSettings["_isTitleVisible"]
							},
							"measureAxis": _chartSettings["_measureAxis"],
							"dimensionAxis": _chartSettings["_dimensionAxis"],
							"data": {
								"json": {
									"measures": data
								},
								"path": "/measures"
							},
							"dimensions": [{
								"label": _chartSettings["dimensionLabel"],
								"value": _chartSettings["dimensionProperty"]
							}],
							"measures": [{
								"label": _chartSettings["measureLabel"],
								"value": _chartSettings["measureProperty"]
							}]
						}
					};
					_analyticObject["sap.app"] = _sapAppObj;
					_analyticObject["sap.card"] = _sapCardObj;
					_finalObject[_chartSettings["_analyticType"]] = _analyticObject;
					return _finalObject;
					break;
				case "timeline":
					let _sapAppObjTimeline = {
						"type": _chartSettings["_cardType"]
					};
					let _sapCardObjTimeline = {
						"type": "Timeline",
						// "header": {
						// 	"title": _chartSettings["_cardTitle"]
						// },
						"content": {
							"data": {
								"json": data
							},
							"item": {
								"description": {
									"value": _chartSettings["_listDescription"]
								},
								"title": {
									"value": _chartSettings["_listTitle"]
								},
								"icon": {
									"src": _chartSettings["_listIcon"]
								},
								"actions": [{
									"type": "Custom"
								}]
							},

						}
					};
					_analyticObject["sap.app"] = _sapAppObjTimeline;
					_analyticObject["sap.card"] = _sapCardObjTimeline;
					_finalObject[_chartSettings["_analyticType"]] = _analyticObject;
					return _finalObject;
					break;
			}
		},
		_downloadKeyValueTemplate: function (attributeData, radioSelection) {
			let _arr = [];
			if (radioSelection === 1) {
				_arr.push({
					'key': 'articleCode',
					'value': 'vdm.lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				}); //Model Key and i18n Text Key
				_arr.push({
					'key': 'articleDescription',
					'value': 'vdm.lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'oldArticleCode',
					'value': 'vdm.lblOldArticle',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'typeOfOrder',
					'value': 'vdm.lblTypeOfOrder',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'legacyVendor',
					'value': 'vdm.lblLegacyVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				// _arr.push({
				// 	'key': 'articleTypeIndex',
				// 	'value': 'lblArticleType',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
				_arr.push({
					'key': 'level1Code',
					'value': 'vdm.lblL1',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level2Code',
					'value': 'vdm.lblL2',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level3Code',
					'value': 'vdm.lblL3',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level4Code',
					'value': 'vdm.lblL4',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level5Code',
					'value': 'vdm.lblL5',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level6Code',
					'value': 'vdm.lblL6',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'orderingUnit',
					'value': 'vdm.lblOrderingUnit',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'baseUOM',
					'value': 'vdm.lblBaseUnitOfMeasure',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'minimumQuantity',
					'value': 'vdm.lblMinimumOrderQty',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'conversionFactor',
					'value': 'vdm.lblConversionFactor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'storageCondition',
					'value': 'vdm.lblStorageCondition',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'shelfLife',
					'value': 'vdm.lblShelfLife',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerVendorCode',
					'value': 'vdm.lblManufacturerVendorCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerProductCode',
					'value': 'vdm.lblManufacturerProductCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'deliveryStartDate',
					'value': 'vdm.lblDeliveryStartDate',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryEndDate',
					'value': 'vdm.lblDeliveryEndDate',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'validFrom',
					'value': 'vdm.lblValidFrom',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'validTo',
					'value': 'vdm.lblValidTo',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'offVendorPrice',
					'value': 'vdm.lblOffVendorPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentage',
					'value': 'vdm.lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'contractPrice',
					'value': 'vdm.lblContractPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_.forEach(attributeData, function (_attr) {
					_arr.push({
						'key': _attr.attributeKey,
						'value': _attr.attributeText,
						'isi18n': false,
						'type': 'S',
						'length': 0
					});
				});

				_arr.push({
					'key': 'attachmentId',
					'value': 'vdm.lblAttachmentId',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
			} else if (radioSelection === 4 || radioSelection === 3) { //For Price Update Mass
				_arr.push({
					'key': 'articleCode',
					'value': 'lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'articleDescription',
					'value': 'lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				// _arr.push({
				// 	'key': 'oldArticleCode',
				// 	'value': 'lblOldArticle',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });

				_arr.push({
					'key': 'validFrom',
					'value': 'lblValidFrom',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'validTo',
					'value': 'lblValidTo',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'offVendorPrice',
					'value': 'lblOffVendorPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentage',
					'value': 'lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentageText',
					'value': 'lblTaxText',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'noOfDays',
					'value': 'lblPriceExpiry',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'typeOfOrder',
					'value': 'lblTypeOfOrder',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'vendor',
					'value': 'lblSAPVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'legacyVendor',
					'value': 'lblLegacyVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'standardCostUpload',
					'value': 'lblStandardCost',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				// _arr.push({
				// 	'key': 'attachmentId',
				// 	'value': 'lblAttachmentId',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
			} else if (radioSelection === 6) {
				_arr.push({
					'key': 'articleCode',
					'value': 'vdm.lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'articleDescription',
					'value': 'vdm.lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'oldArticleCode',
					'value': 'vdm.lblOldArticle',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryDateStart',
					'value': 'vdm.lblDeliveryDateStart',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryDateEnd',
					'value': 'vdm.lblDeliveryDateEnd',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
			}
			return _arr;
		},
		_downloadKeyValueTemplateReport: function (attributeData, radioSelection) {
			let _arr = [];
			if (radioSelection === 1) {
				_arr.push({
					'key': 'articleCode',
					'value': 'vdm.lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				}); //Model Key and i18n Text Key
				_arr.push({
					'key': 'articleDescription',
					'value': 'vdm.lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'oldArticleCode',
					'value': 'vdm.lblOldArticle',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'typeOfOrder',
					'value': 'vdm.lblTypeOfOrder',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'legacyVendor',
					'value': 'vdm.lblLegacyVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				// _arr.push({
				// 	'key': 'articleTypeIndex',
				// 	'value': 'lblArticleType',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
				_arr.push({
					'key': 'level1Code',
					'value': 'vdm.lblL1',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level2Code',
					'value': 'vdm.lblL2',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level3Code',
					'value': 'vdm.lblL3',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level4Code',
					'value': 'vdm.lblL4',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level5Code',
					'value': 'vdm.lblL5',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level6Code',
					'value': 'vdm.lblL6',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'orderingUnit',
					'value': 'vdm.lblOrderingUnit',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'baseUOM',
					'value': 'vdm.lblBaseUnitOfMeasure',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'minimumQuantity',
					'value': 'vdm.lblMinimumOrderQty',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'conversionFactor',
					'value': 'vdm.lblConversionFactor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'storageCondition',
					'value': 'vdm.lblStorageCondition',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'shelfLife',
					'value': 'vdm.lblShelfLife',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerVendorCode',
					'value': 'vdm.lblManufacturerVendorCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerProductCode',
					'value': 'vdm.lblManufacturerProductCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'deliveryStartDate',
					'value': 'vdm.lblDeliveryStartDate',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryEndDate',
					'value': 'vdm.lblDeliveryEndDate',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'validFrom',
					'value': 'vdm.lblValidFrom',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'validTo',
					'value': 'vdm.lblValidTo',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'offVendorPrice',
					'value': 'vdm.lblOffVendorPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentage',
					'value': 'vdm.lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'contractPrice',
					'value': 'vdm.lblContractPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_.forEach(attributeData, function (_attr) {
					_arr.push({
						'key': _attr.attributeKey,
						'value': _attr.attributeText,
						'isi18n': false,
						'type': 'S',
						'length': 0
					});
				});

				_arr.push({
					'key': 'attachmentId',
					'value': 'vdm.lblAttachmentId',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
			} else if (radioSelection === 4 || radioSelection === 3) { //For Price Update Mass
				_arr.push({
					'key': 'articleCode',
					'value': 'lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'articleDescription',
					'value': 'lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'siteCode',
					'value': 'lblSiteCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'siteDescription',
					'value': 'lblSite',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'regionCode',
					'value': 'lblRegionCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'regionDescription',
					'value': 'lblRegion',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				// _arr.push({
				// 	'key': 'oldArticleCode',
				// 	'value': 'lblOldArticle',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });

				_arr.push({
					'key': 'validFrom',
					'value': 'lblValidFrom',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'validTo',
					'value': 'lblValidTo',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'offVendorPrice',
					'value': 'lblOffVendorPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentage',
					'value': 'lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentageText',
					'value': 'lblTaxText',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'noOfDays',
					'value': 'lblPriceExpiry',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'vendor',
					'value': 'lblSAPVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'name',
					'value': 'lblTypeOfOrder',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				// _arr.push({
				// 	'key': 'legacyVendor',
				// 	'value': 'lblLegacyVendor',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
				// _arr.push({
				// 	'key': 'standardCostUpload',
				// 	'value': 'lblStandardCost',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
				// _arr.push({
				// 	'key': 'attachmentId',
				// 	'value': 'lblAttachmentId',
				// 	'isi18n': true,
				// 	'type': 'S',
				// 	'length': 0
				// });
			} else if (radioSelection === 6) {
				_arr.push({
					'key': 'articleCode',
					'value': 'vdm.lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'articleDescription',
					'value': 'vdm.lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'oldArticleCode',
					'value': 'vdm.lblOldArticle',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryDateStart',
					'value': 'vdm.lblDeliveryDateStart',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'deliveryDateEnd',
					'value': 'vdm.lblDeliveryDateEnd',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
			}
			return _arr;
		},
		_downloadKeyValueTemplateDownload: function (attributeData, radioSelection) {
			let _arr = [];
			if (radioSelection === 1) {
				_arr.push({
					'key': 'articleCode',
					'value': 'lblCompassArticleCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				}); //Model Key and i18n Text Key
				_arr.push({
					'key': 'articleDescription',
					'value': 'lblCompassArticleDescription',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'oldArticleCode',
					'value': 'lblOldArticle',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'typeOfOrder',
					'value': 'lblTypeOfOrder',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'vendor',
					'value': 'lblSAPVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'legacyVendor',
					'value': 'lblLegacyVendor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'level1Code',
					'value': 'lblL1',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level1Description',
					'value': 'lblL1',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level2Code',
					'value': 'lblL2',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level2Description',
					'value': 'lblL2',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'level3Code',
					'value': 'lblL3',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level3Description',
					'value': 'lblL3',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'level4Code',
					'value': 'lblL4',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level4Description',
					'value': 'lblL4',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level5Code',
					'value': 'lblL5',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level5Description',
					'value': 'lblL5',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'level6Code',
					'value': 'lblL6',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'level6Description',
					'value': 'lblL6',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'orderingUnit',
					'value': 'lblOrderingUnit',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'orderingUnitText',
					'value': 'lblOrderingUnit',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'baseUOM',
					'value': 'lblBaseUnitOfMeasure',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'baseUOMText',
					'value': 'lblBaseUnitOfMeasure',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'minimumQuantity',
					'value': 'lblMinimumOrderQty',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'conversionFactor',
					'value': 'lblConversionFactor',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'storageCondition',
					'value': 'lblStorageCondition',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'storageConditionText',
					'value': 'lblStorageCondition',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'shelfLife',
					'value': 'lblShelfLife',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerVendorCode',
					'value': 'lblManufacturerVendorCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'manufacturerProductCode',
					'value': 'lblManufacturerProductCode',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'validFrom',
					'value': 'lblValidFrom',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'validTo',
					'value': 'lblValidTo',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'offVendorPrice',
					'value': 'lblOffVendorPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentage',
					'value': 'lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'taxPercentageText',
					'value': 'lblTax',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_arr.push({
					'key': 'contractPrice',
					'value': 'lblContractPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});
				_arr.push({
					'key': 'contractPriceText',
					'value': 'lblContractPrice',
					'isi18n': true,
					'type': 'S',
					'length': 0
				});

				_.forEach(attributeData, function (_attr) {
					_arr.push({
						'key': _attr.attributeKey,
						'value': _attr.attributeText,
						'isi18n': false,
						'type': 'S',
						'length': 0
					});
				});

			} else { //For Price Update Mass

			}

			return _arr;
		},
		_setVendor: function (_vendorId) {
			this.vendorId = _vendorId;
		},
		_getVendor: function () {
			return this.vendorId;
		},
		_setInstitute: function (_instituteId) {
			this.instituteId = _instituteId;
		},
		_getInstitute: function () {
			return this.instituteId;
		},
		_setAdmin: function (_isAdmin) {
			this.isAdmin = _isAdmin;
		},
		_getAdmin: function () {
			return this.isAdmin;
		},
		_getDownloadReportFields: function (_reportType, _fields, i18nModel) {
			let _arr = [];
			let _pricingReportMapping = [{
				"key": "articleCode",
				"sapField": "MATNR",
				"isText": false
			}, {
				"key": "articleDescription",
				"sapField": "MAKTX",
				"isText": false
			}, {
				"key": "oldArticleCode",
				"sapField": "BISMT",
				"isText": false
			}, {
				"key": "validFrom",
				"sapField": "DATAB",
				"isText": false
			}, {
				"key": "validTo",
				"sapField": "DATBI",
				"isText": false
			}, {
				"key": "offVendorPrice",
				"sapField": "KBETR",
				"isText": false
			}, {
				"key": "taxPercentage",
				"sapField": "MWSKZ",
				"isText": false
			}, {
				"key": "taxPercentageText",
				"sapField": "MWSKZ_TXT",
				"isText": false
			}, {
				"key": "noOfDays",
				"sapField": "NODAYS",
				"isText": false
			}, {
				"key": "typeOfOrder",
				"sapField": "ORD_TYPE",
				"isText": false
			}, {
				"key": "vendor",
				"sapField": "LIFNR",
				"isText": false
			},
			{
				"key": "legacyVendor",
				"sapField": "LIFNR",
				"isText": false
			},
			];
			let _articleReportMapping = [{
				"key": "articleCode",
				"sapField": "MATNR",
				"isText": false
			}, {
				"key": "articleDescription",
				"sapField": "MAKTX",
				"isText": false
			}, {
				"key": "oldArticleCode",
				"sapField": "BISMT",
				"isText": false
			}, {
				"key": "typeOfOrder",
				"sapField": "ORD_TYPE",
				"isText": false
			}, {
				"key": "vendor",
				"sapField": "LIFNR",
				"isText": false
			}, {
				"key": "legacyVendor",
				"sapField": "SORTL",
				"isText": false
			}, {
				"key": "level1Code",
				"sapField": "WWGHB_L1",
				"isText": false
			}, {
				"key": "level1Description",
				"sapField": "WWGHB_L1",
				"isText": false
			}, {
				"key": "level2Code",
				"sapField": "WWGHB_L2",
				"isText": false
			}, {
				"key": "level2Description",
				"sapField": "WWGHB_L2",
				"isText": false
			}, {
				"key": "level3Code",
				"sapField": "WWGHB_L3",
				"isText": false
			}, {
				"key": "level3Description",
				"sapField": "WWGHB_L3",
				"isText": false
			}, {
				"key": "level4Code",
				"sapField": "WWGHB_L4",
				"isText": false
			}, {
				"key": "level4Description",
				"sapField": "WWGHB_L4",
				"isText": false
			}, {
				"key": "level5Code",
				"sapField": "WWGHB_L5",
				"isText": false
			}, {
				"key": "level5Description",
				"sapField": "WWGHB_L5",
				"isText": false
			}, {
				"key": "level6Code",
				"sapField": "WWGHB_L6",
				"isText": false
			}, {
				"key": "level6Description",
				"sapField": "WWGHB_L6",
				"isText": false
			}, {
				"key": "orderingUnit",
				"sapField": "BSTME",
				"isText": false
			}, {
				"key": "orderingUnitText",
				"sapField": "BSTME",
				"isText": true
			}, {
				"key": "baseUOM",
				"sapField": "MEINS",
				"isText": false
			}, {
				"key": "baseUOMText",
				"sapField": "MEINS",
				"isText": true
			}, {
				"key": "minimumQuantity",
				"sapField": "MINBM",
				"isText": false
			}, {
				"key": "conversionFactor",
				"sapField": "UMREZ",
				"isText": false
			}, {
				"key": "storageCondition",
				"sapField": "RAUBE",
				"isText": false
			}, {
				"key": "storageConditionText",
				"sapField": "RBTXT",
				"isText": false
			}, {
				"key": "shelfLife",
				"sapField": "MHDRZ",
				"isText": false
			}, {
				"key": "manufacturerVendorCode",
				"sapField": "MFRNR",
				"isText": false
			}, {
				"key": "manufacturerProductCode",
				"sapField": "IDNLF",
				"isText": false
			}, {
				"key": "validFrom",
				"sapField": "DATAB",
				"isText": false
			}, {
				"key": "validTo",
				"sapField": "DATBI",
				"isText": false
			}, {
				"key": "offVendorPrice",
				"sapField": "KBETR",
				"isText": false
			}, {
				"key": "taxPercentage",
				"sapField": "MWSKZ",
				"isText": false
			}, {
				"key": "taxPercentageText",
				"sapField": "MWSKZ_TXT",
				"isText": false
			}, {
				"key": "contractPrice",
				"sapField": "PRICEUNIT",
				"isText": false
			}, {
				"key": "contractPriceText",
				"sapField": "PRICELEVEL",
				"isText": false
			}];
			switch (_reportType) {
				case "01": //Pricing Report
					_.forEach(_fields, function (field, idx) {
						let _backendObj = _.find(_pricingReportMapping, {
							"key": field.key
						});
						_arr.push({
							"sortOrder": (idx + 1).toString(),
							"fieldName": _backendObj.sapField,
							"fieldDescription": field.isi18n ? i18nModel.getResourceBundle().getText(field.value) : "",
							"isText": _backendObj.isText ? 'X' : ''
						});
					});
					break;
				case "02": //Article Report
					_.forEach(_fields, function (field, idx) {

						if (field.isi18n) {
							let _backendObj = _.find(_articleReportMapping, {
								"key": field.key
							});
							_arr.push({
								"sortOrder": (idx + 1).toString(),
								"fieldName": _backendObj.sapField,
								"fieldDescription": i18nModel.getResourceBundle().getText(field.value),
								"isText": _backendObj.isText ? 'X' : ''
							});
						} else {
							_arr.push({
								"sortOrder": (idx + 1).toString(),
								"fieldName": field.key,
								"fieldDescription": field.value,
								"isText": ''
							});
						}
					});
					break;
			}
			return _arr;
		}

	};
}());