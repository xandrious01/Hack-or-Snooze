"use strict";
console.debug("nav.js")

async function navAllStories(evt) {
  hidePageComponents();
  if ($body.hasClass("on-favs-page") || $body.hasClass("on-user-stories-page")) {
    $body.removeClass("on-favs-page");
    $body.removeClass("on-user-stories-page");
  }
  $newPostBtn.on("click", showNewPostForm);
  $navFavs.on("click", navFavorites);
  $navOwnStories.on("click", navOwnStories);
  await getAndShowStoriesOnStart();
}

$navAll.on("click", navAllStories)

function navLoginClick(evt) {
  hidePageComponents();
  $loginFavsMsg.hide();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function updateNavOnLogin(evt) {
  $(".main-nav-links").show();
  $navFavs.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$newPostBtn.hover(function () {
  $(this).css('cursor', 'pointer').attr('title', 'New Story');
}, function () {
  $(this).css('cursor', 'auto');
});

$newPostBtn.on("click", showNewPostForm)

function showNewPostForm() {
  const token = localStorage.getItem("token") ? localStorage.getItem("token") : null;
  if (token) {
    $('#new-story-section').toggleClass("hidden");
  } else {
    $allStoriesList.empty();
    hideUserMessages();
    $loginMsg.show();
    appendBackBtn($loginMsg); 
  }
}

$navFavs.on("click", navFavorites)

function navFavorites() {

  if (!(currentUser)) {
    
    hidePageComponents();
    $allStoriesList.empty();
    $loginFavsMsg.show();
    appendBackBtn($loginFavsMsg);

  } else if ((currentUser) && (currentUser.favorites.length === 0)) {
    
    hidePageComponents();
    $allStoriesList.empty();
    $favsMessage.show();
    appendBackBtn($favsMessage);
  
  } else {
    
    hidePageComponents();
    $body.addClass(("on-favs-page"));
    turnOffFavsBtn();
    putStoriesOnPage();
  }
}

$navOwnStories.on("click", navOwnStories);

async function navOwnStories(){
  $body.addClass("on-user-stories-page")
  await getAndShowStoriesOnStart();
  // hidePageComponents();
  // hideUserMessages();
  // $allStoriesList.empty();

}

function appendBackBtn(msg) {
  const $backBtn = $('<button class="back-btn">Go Back</button>');
  $backBtn.on("click", handleBackBtn);
  if (!(msg.children()[1])){
    msg.append($backBtn);
  }
}

async function handleBackBtn(e) {
  e.target.remove();
  hidePageComponents();
  await getAndShowStoriesOnStart();
  $newPostBtn.on("click", showNewPostForm);
  $navFavs.on("click", navFavorites);
}

function turnOffFavsBtn(){
  !($body.hasClass("on-favs-page")) ? $navFavs.on("click", navFavorites) : $navFavs.off("click", navFavorites);
}
