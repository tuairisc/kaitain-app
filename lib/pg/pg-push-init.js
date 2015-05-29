/**
 * TODO: Replace the following variables when app is built
 * TODO: look into adding unregister function somewhere
 */

var userAccessKey = '[[userAccessKey]]';
var userSecretKey = '[[userSecretKey]]';
var gcmSenderId = '[[gcmSenderId]]';
var gcmAppArn = '[[gcmAppArn]]';
var snsTopicArn = '[[snsTopicArn]]';
var ApnsAppArn = '[[ApnsAppArn]]';

var pushNotification;

// AWS setup.  Should hard code users credentials
AWS.config.update({accessKeyId: userAccessKey, secretAccessKey: userSecretKey });

AWS.config.region = 'us-west-2';

var sns = new AWS.SNS();

function pushInit() {

    try 
    { 
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(successHandler, errorHandler, {"senderID": gcmSenderId,"ecb":"onNotificationGCM"});     // required!
        } else {
            pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
        }
    }
    catch(err) 
    { 
        txt="There was an error on this page.\n\n"; 
        txt+="Error description: " + err.message + "\n\n"; 
        console.log(txt); 
    } 
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    
    switch( e.event )
    {
        case 'registered':
        if ( e.regid.length > 0 )
        {
            // e.regid is the device token for the amazon SNS endpoint
            console.log("Register success. regID = " + e.regid);
            // Send token to amazon sns to register

            registerEndpoint(e.regid);
        }
        break;
        
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {

                alert(e.message);
                
                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/"+e.soundname);
                //my_media.play();
            }
            else
            {   // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    alert(e.message);
                else
                    alert(e.message);
            }
                
        break;
        
        case 'error':
            console.log('Error: ' + e.msg);
        break;
        
        default:
            console.log('Unknown event ' + e.msg);
        break;
    }
}

function registerEndpoint(token) {

    if (device.platform == 'android' || device.platform == 'Android') {

        var params = {
            // GCM platform Arn here
          PlatformApplicationArn: gcmAppArn, /* required */
          Token: token, /* required */
        };

    } else {

        var params = {
            // iOS platform Arn here
          PlatformApplicationArn: ApnsAppArn, /* required */
          Token: token, /* required */
        };

    }

    sns.createPlatformEndpoint(params, function(err, data) {
      if (err) {
        console.log('Error: ' + err); // an error occurred
      } else { 
        console.log('Endpoint Arn: ' + data.EndpointArn);
        // if the endpoint is created successfully, subscribe it to our topic
        subscribeToTopic(data.EndpointArn);
      }
    });
}

function subscribeToTopic(endpointArn) {
    // auto-subscribe devices to our topic, so we can push to ios/android at the same time
    var params = {
      Protocol: 'application', /* required */
      // TopicArn should be hard coded from app creation
      TopicArn: snsTopicArn, /* required */
      // Get Endpoint from createPlatformEndpoint() above
      Endpoint: endpointArn
    };
    sns.subscribe(params, function(err, data) {
      if (err) console.log( 'Error: ' + err, err.stack); // an error occurred
      else     console.log( 'Subscribe success: ' + data);           // successful response
    });
}

function tokenHandler (result) {
    // Send token to amazon sns to register
    registerEndpoint(result);
}

function successHandler (result) {
    console.log('Success ' + result);
}

function errorHandler (error) {
     console.log('Error: ' + error);
}

// This should go in deviceready instead of setTimeout
setTimeout( pushInit, 3000 );
