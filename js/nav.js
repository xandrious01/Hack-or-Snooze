"use strict";
console.debug("nav.js")

function navAllStories(evt) {
  hidePageComponents();
  if($body.hasClass("on-favs-page")){
    $body.removeClass("on-favs-page");
    getAndShowStoriesOnStart();
  }
}

$body.on("click", "#nav-all", navAllStories);

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function updateNavOnLogin() {
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
      loginComponents.forEach(c => c.show());
    }
    $newPostBtn.off("click", showNewPostForm)
    const $backBtn = $('<button>Go Back</button>');
    $loginMsg.append($backBtn)
    $backBtn.on("click", handleBackBtn)
  }

async function handleBackBtn(e){
  e.target.remove();
  loginComponents.forEach(c => c.hide());
  await getAndShowStoriesOnStart();
  $newPostBtn.on("click", showNewPostForm)
}

$navFavs.on("click", navFavorites)

function navFavorites(){
  location.replace(location.href);
  $body.addClass(("on-favs-page"));
  putStoriesOnPage();
}
