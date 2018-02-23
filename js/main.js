
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


})(jQuery);


//AUTHENTICATION
function goToSignIn(){
  window.location.href='/sign_in.html'
}

function goToSignUp(){
  window.location.href='/sign_up.html'
}

function goToResetPassword(){
  window.location.href='/reset_password.html'
}

function goToMain(){
  window.location.href='/index.html'
}

function goToAdmin(){
  window.location.href='/admin.html'
}

function initApp() {
      // Listening for auth state changes.

      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;

        } else {
          goToSignIn()
        }

      });
}


function toggleAddDialogCreateVideo(visible) {
      var createVideoContainer = document.getElementById("create-video-container");
      //createVideoContainer.classList.add("dialog-container--visible");
      if (visible) {
        createVideoContainer.classList.add("dialog-container--visible");
      } else {
        createVideoContainer.classList.remove("dialog-container--visible");
      }
      
};

function toggleAddDialogWatchVideo(visible, videoUrl) {
      var watchVideoContainer = document.getElementById("watch-video-container");
      //watchVideoContainer.classList.add("dialog-container--visible");
      if (visible) {
        watchVideoContainer.classList.add("dialog-container--visible");
        console.log(videoUrl);
        document.getElementById("videoSrc").src = 'https://player.vimeo.com/video/' + videoUrl;
      } else {
        watchVideoContainer.classList.remove("dialog-container--visible");
      }
};

// // TODO add service worker code here
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//            .register('./service-worker.js')
//            .then(function() { console.log('Service Worker Registered'); });
// }
