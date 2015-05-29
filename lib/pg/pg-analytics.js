var AnalyticsAccount = "[[AnalyticsAccount]]";

var analyticsReplace = AnalyticsAccount.indexOf("[[");

function gaerrorHandler(e) {
    console.log('ga error' + e);
}

function gasuccesshandler() {
    console.log('GA tracking on');
}

function gainit() {
	// if analytics code has not been swapped out, don't load gaPlugin
    if( analyticsReplace != 0 ) {
	    gaPlugin = window.plugins.gaPlugin;
	    gaPlugin.init(gasuccesshandler, gaerrorHandler, AnalyticsAccount, 10);
	}
}
