"use strict";
console.debug("main.js")

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navFavs = $("#nav-favs");

const $newPostBtn = $('#new-post-btn');
const $newStoryForm = $('#new-story-form');
const $loginMsg = $('#login-message');

const loginComponents = [
        $loginForm,
        $signupForm,
        $loginMsg
      ];


function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm
    
  ];
  components.forEach(c => c.hide());
}


async function start() {

  await checkForRememberedUser();
  await getAndShowStoriesOnStart();
  
  if (currentUser) updateUIOnUserLogin();
}

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}


$(start);
