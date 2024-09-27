jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.declare("zninsurancecre.util.Formatter");

zninsurancecre.util.Formatter = (function () {
	return {
		_generateRandomKey: function (length) {
			var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var result = '';
			for (var i = 0; i < length; i++) {
				result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
			}
			return result;
		},
		_getPatientAge: function (_birthDate) {
			const date = moment(_birthDate, 'YYYY-MM-DD')
			const years = moment().diff(date, 'years')
			const days = moment().diff(date.add(years, 'years'), 'days', false);
			return years + " Year" + ", " + days + " Days";
		},
		_getInitials: function (string) {
			var names = string.split(' '),
				initials = names[0].substring(0, 1).toUpperCase();

			if (names.length > 1) {
				initials += names[names.length - 1].substring(0, 1).toUpperCase();
			}
			return initials;
		},
	};
}());