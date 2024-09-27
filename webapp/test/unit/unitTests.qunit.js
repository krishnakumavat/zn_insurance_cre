/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zn_insurance_cre/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
