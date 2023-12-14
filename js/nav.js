"use strict";

async function navAllStories(evt) {
  hidePageComponents();
  hideUserMessages();
  $body.removeClass();
  $newPostBtn.on("click", showNewPostForm);
  await getAndShowStoriesOnStart();
}

$navAll.on("click", navAllStories)

function navLoginClick(evt) {
  hidePageComponents();
  hideUserMessages();
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
  $loginForm.hide();
  $signupForm.hide();
  hideUserMessages();
  if (token) {
    $("#new-story-section").show();
  } else {
    $allStoriesList.empty();
    $loginMsg.show();
    $backBtn.show();
  }
}

$navFavs.on("click", navFavorites)

async function navFavorites() {
  $body.removeClass();
  hidePageComponents();
  hideUserMessages();
  $("#new-story-section").hide();
  if (checkForUserAndFavs()!==false) {
    $body.addClass("on-favs-page");
    await getAndShowStoriesOnStart();
  }  
}

function checkForUserAndFavs() {
  $allStoriesList.empty();
  if (!(currentUser)) {
    $loginFavsMsg.show();
    $backBtn.show();
    return false;
  } else if ((currentUser.favorites.length === 0)) {
    $favsMessage.show();
    $backBtn.show();
    return false;
  }
  
}

$navOwnStories.on("click", navOwnStories);

async function navOwnStories() {
  $body.removeClass();
  hidePageComponents();
  hideUserMessages();
  $("#new-story-section").hide();
  if (checkForUserAndOwnStories()!==false) {
    $body.addClass("on-user-stories-page");
    await getAndShowStoriesOnStart();
  } 
}

function checkForUserAndOwnStories() {
  $allStoriesList.empty();
  if (!(currentUser)) {
    $loginOwnStories.show();
    $backBtn.show();
    return false;
  } else if ((currentUser.ownStories.length === 0)) {
    $noUserStories.show();
    $backBtn.show();
    return false;
  }
}

$backBtn.on("click", handleBackBtn);

async function handleBackBtn(e) {
  $backBtn.hide();
  hidePageComponents();
  hideUserMessages();
  $body.removeClass();
  await getAndShowStoriesOnStart();
}
