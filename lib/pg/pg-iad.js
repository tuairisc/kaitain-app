document.addEventListener( 'deviceready', onDeviceReadyiAd, false );
document.addEventListener("onClickAd", onClickAd, false);
document.addEventListener("onReceiveAd", onReceiveAd, false);
document.addEventListener("onFailedToReceiveAd", onFailedToReceiveAd, false);


function onDeviceReadyiAd() {



}

function onClickAd() {
	// count click
	console.log( 'clicked');       
}
function onReceiveAd() {
    // do whatever you want 
    console.log( 'recieved'); 
}
function onFailedToReceiveAd( ret ) {
	console.log( 'failed'); 
    // alert( ret.error ); 
    // no need to handle it, sometimes ad just not loaded in time, but iad will try reload, 
    // once it's loaded, it will be displayed.
}
