var url = 'http://tuairisc.ie';
var api = url + '/wp-json';
var api2 = 'http://reactor.apppresser.com/tuairisc/wp-json/appp/v1/12';
var app_data = 'app-data.json';

var ad_units = {
    android : {
        banner: ''
    }
};
var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : false;

// this code is for preview
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

var appUrl = getURLParameter('appUrl');
var dataUrl = getURLParameter('dataUrl');

 if(dataUrl){
	 localStorage.removeItem('localData');
	 url = dataUrl;
	 api = dataUrl + '/wp-json';
	 api2 = appUrl;
	 app_data = appUrl;
	 var appPreview = true;
 }
