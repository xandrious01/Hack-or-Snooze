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
const $navAll = $("#nav-all");
const $navOwnStories = $("#nav-user-stories");

const $favsMessage = $("#favorites-message");
const $loginFavsMsg = $("#login-msg-favs");
const $loginMsg = $('#login-message');
const $noUserStories = $("#no-user-stories-msg");
const $loginOwnStories = $("#login-own-stories");

const $newPostBtn = $('#new-post-btn');
const $newStoryForm = $('#new-story-form');


const $backBtn = $("#back-btn");

const userMessages = [
        $loginMsg,
        $loginFavsMsg,
        $favsMessage,
        $noUserStories,
        $loginOwnStories,
        $backBtn
      ];


function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

function hideUserMessages() {
  const messages = userMessages;
  messages.forEach(m => m.hide());
}


async function start() {
  $backBtn.hide();
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
