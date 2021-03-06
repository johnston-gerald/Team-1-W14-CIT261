(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

var helper = (function() {
var BASE_API_PATH = 'plus/v1/';

return {
    /**
     * Hides the sign in button and starts the post-authorization operations.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {
      gapi.client.load('plus','v1', function(){
        $('#authResult').html('Auth Result:<br/>');
        for (var field in authResult) {
          $('#authResult').append(' ' + field + ': ' +
              authResult[field] + '<br/>');
        }
        if (authResult['access_token']) {
          //$('#authOps').show('slow');
          $('#gConnect').hide();
          helper.profile();
          //helper.people();


        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          // As an example, you can handle by writing to the console:
          console.log('There was an error: ' + authResult['error']);
          $('#authResult').append('Logged out');
          $('#authOps').hide('slow');
          $('#gConnect').show();
        }
        //console.log('authResult', authResult);
      });
    },
    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    disconnect: function() {
        // Revoke the access token.
        $.ajax({
            type: 'GET',
            url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
                gapi.auth.getToken().access_token,
            async: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(result) {
                console.log('revoke response: ' + result);
                $('#authOps').hide();
                $('#profile').empty();
                $('#authResult').empty();
                $('#gConnect').show();
                localStorage.clear();
                listapp.clear();
            },
            error: function(e) {
              console.log(e);
            }
        });
    },
        /**
         * Gets and renders the currently signed in user's profile data.
         */
    profile: function(){
        var request = gapi.client.plus.people.get( {'userId' : 'me'} );

        request.execute( function(profile) {
            var email = profile.emails[0].value;

            //Enter user into database///////////////////////////////////////////////////////
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST","php/get_user.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("id="+profile.id+"&user_name="+profile.displayName+"&email="+email);
            /////////////////////////////////////////////////////////////////////////////////

            /*$('#profile').empty();

            if (profile.error) {
              $('#profile').append(profile.error);
              return;
            }

            $('#profile').append($('<p><img src=\"' + profile.image.url + '\"></p>'));
            $('#profile').append($('<p>Hello ' + profile.displayName 
                + '<br />ID: ' + profile.id
                + '<br />Email: ' +  email
                + '<br />Tagline: ' + profile.tagline + 
                '<br />About: ' + profile.aboutMe + '</p>'));

            if (profile.cover && profile.coverPhoto) {
                $('#profile').append(
                $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
            }*/

            if (typeof(Storage) != "undefined") {
                // Store
                localStorage.setItem("user_name", profile.displayName);
                localStorage.setItem("id", profile.id);
                localStorage.setItem("email", email);
                //starts app
                startApp();
                // Retrieve
          } else {
            document.getElementById("result").innerHTML="Sorry, your browser does not support Web Storage...";
          }
        });
    }
};
})();

/**
 * jQuery initialization
 */
$(document).ready(function() {
  $('#disconnect').click(helper.disconnect);
  $('#loaderror').hide();
  if ($('[data-clientid="YOUR_CLIENT_ID"]').length > 0) {
    alert('This sample requires your OAuth credentials (client ID) ' +
        'from the Google APIs console:\n' +
        '    https://code.google.com/apis/console/#:access\n\n' +
        'Find and replace YOUR_CLIENT_ID with your client ID.'
    );
  }
});

/**
 * Calls the helper method that handles the authentication flow.
 *
 * @param {Object} authResult An Object which contains the access token and
 *   other authentication information.
 */
function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);

}

function startApp(){
    listapp.login();
    listapp.showMenu();
    listapp.getLists();
}