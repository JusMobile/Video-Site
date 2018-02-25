

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

function goProfile() {
  window.location.href='/profile.html'
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


//----------------INDEX---------------------- //

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



function showAdminPart(user) {
  firebase.database().ref('users/' + user.uid ).once('value')
  .then(function(snapshot) {
    if(snapshot.val().admin){
      var buttonAdmin = '<a onclick="goToAdmin()"  class="w3-bar-item w3-button">Administração</a>'
      $("#leftMenu").append(buttonAdmin);
    }else{

    }
    //console.log(snapshot.val().admin);
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
  });
}

function openLeftMenu() {
  document.getElementById("leftMenu").style.display = "block";
}
function closeLeftMenu() {
  document.getElementById("leftMenu").style.display = "none";
}

function logOutUser() {
  firebase.auth().signOut();
}

function changePassword() {
  var currentUser = firebase.auth().currentUser;

  firebase.auth().sendPasswordResetEmail(currentUser.email)
  .then(function() {

    alert('Um email para troca de senha foi enviado!');
    // /goToSignIn()

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);

  });
}

function getData(){

  firebase.database().ref("/videos").on("value", function(snapshot) {
      // location.reload();
      // console.log("changed");
      $( ".col-md-4" ).remove();
      snapshot.forEach(function(childSnapshot) {
        // key
        var key = childSnapshot.key;
        // value, could be object
        var childData = childSnapshot.val();
        // Do what you want with these key/values here

        var card = '<div class="col-md-4"><div class="card" onclick="toggleAddDialogWatchVideo(true, ' + childData.url + ')"><img src="' + childData.thumbnail + '" alt="Avatar" style="width:100%; height: 200px;">'
        var cardContainer = '<div class="container"> <h4 class="video-author-name"> <b>'+ childData.author + '</b> </h4> <p>' + childData.description +'</p> <p class="video-date-published">' + childData.datePublish + '</p> </div>'
        var endDiv = '</div> </div>'
        html = card + cardContainer + endDiv

        $(".row").append(html);

      });
  });
}



//----------------RESET PASSWORD---------------------- //

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {

    alert('Password Reset Email Sent!');
    goToSignIn()

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);

  });

}

//----------------SIGNIN---------------------- //

function handleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);

    });

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        goToMain() //After successful login, user will be redirected to home.html
      }
    });
  }
}

//----------------SIGNUP---------------------- //

function handleSignUp() {
  var coupon = document.getElementById('coupon').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  if (coupon.length < 4) {
    alert('Please enter an coupon.');
    return;
  }

  firebase.database().ref('coupons/' + coupon).once('value')
  .then(function(snapshot) {
    if(snapshot.val().used){
      alert('Cupom ja usado!')
    }else{

      signUpUser(coupon, email, password)

    }
    console.log(snapshot.val().used);
  }, function(error) {
    // The Promise was rejected.
    console.error(error);
  });
}

function signUpUser(coupon, email, password){

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user){
      console.log('uid',user.uid)
      var userModel = {
            admin: false
      }

      firebase.database().ref('users/' + user.uid).set(userModel)
      .then(function onSuccess(res) {

        firebase.database().ref('coupons/' + coupon).set({ used: true, emailUser: email })
        .then(function onSuccess(res) {
          goToMain()
        })


      }).catch(function onError(err) {
        console.error(err);
      });

  }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
  });
}




// // TODO add service worker code here
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//            .register('./service-worker.js')
//            .then(function() { console.log('Service Worker Registered'); });
// }
