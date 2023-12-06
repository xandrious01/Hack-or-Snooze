"use strict";

let storyList;
console.debug("stories.js")

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}


function generateStoryMarkup(story) {
  const hostName = story.getHostName();

  const favStories = localStorage.getObj("favorites");
  let favoritesButton;
  if ((currentUser) && (favStories.indexOf(story.storyId) === -1)) {
    favoritesButton = `<button class="add-fav-btn" id="fav+${story.storyId}">Add Favorite</button>`;
  } else if ((currentUser) && (favStories.indexOf(story.storyId) !== -1)) {
    favoritesButton = `<button class="rem-fav-btn" id="rem+${story.storyId}">Remove Favorite</button>`;
  } else {
    favoritesButton = "";
  }

  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        ${favoritesButton}
      </li>
    `);
}

function putStoriesOnPage() {
  if (!($body.hasClass("on-favs-page"))) {
    storyList = storyList;
  } else if ($body.hasClass("on-favs-page")) {
    storyList = StoryList.getFavorites();
  }
  $allStoriesList.empty();
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

$('#new-story-form').on("submit", postStory);

async function postStory(e) {
  e.preventDefault();
  let storyData = {
    "author": $('#story-author').val(),
    "title": $('#story-title').val(),
    "url": $('#story-url').val()
  }
  const token = localStorage.getItem("token");
  let newStory = await storyList.addStory(token, storyData);
  let $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
  return newStory;
}

$allStoriesList.on("click", ".add-fav-btn", addStoryToFavorites)

async function addStoryToFavorites(e) {
  const storyId = e.target.id.slice(4);
  const response = await currentUser.saveToFavorites(storyId);
  saveFavoritesToLocal(response);
  toggleButtonClasses(e.target, storyId);
}

$allStoriesList.on("click", ".rem-fav-btn", removeStoryFromFavorites)

async function removeStoryFromFavorites(e) {
  const storyId = e.target.id.slice(4);
  const response = await currentUser.removeFromFavorites(storyId);
  let favIds = saveFavoritesToLocal(response);
  if (!($body.hasClass("on-favs-page"))) {
    toggleButtonClasses(e.target, storyId);
  } else {
    $(`#${storyId}`).remove();
  }
}

function saveFavoritesToLocal(response) {
  const favIds = response.data.user.favorites.map(i => i.storyId);
  console.log(favIds)
  console.log(response.data.user.favorites)

  localStorage.setObj("favorites", [favIds]);
  return favIds;
}

function toggleButtonClasses(button, storyId){
  $(button).toggleClass("add-fav-btn rem-fav-btn");
  $(button).hasClass("add-fav-btn") ? $(button).html("Add Favorite") : $(button).html("Remove Favorite");
  $(button).hasClass("add-fav-btn") ? $(button).attr("id", `fav+${storyId}`) : $(button).attr("id", `rem+${storyId}`);
}




