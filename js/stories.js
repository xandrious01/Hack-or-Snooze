"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}


function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  let favStoryIds;
  if(currentUser) {
    favStoryIds = (currentUser.favorites).map(s => s.storyId);
  } else {
    favStoryIds = null;
  }
  let favoritesButton;
  if ((favStoryIds !== null) && !(favStoryIds.includes(story.storyId))) {
    favoritesButton = `<button class="add-fav-btn" id="fav+${story.storyId}">Add Favorite</button>`;
  } else if ((favStoryIds !== null) && favStoryIds.includes(story.storyId)) {
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
  
  storyList = determineStoriesPage();

  $allStoriesList.empty();
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

function determineStoriesPage(){
  switch ($body.attr("class")){
    case ("on-favs-page"):
      storyList = StoryList.getFavorites();
    break;
    case ("on-user-stories-page"):
      storyList = StoryList.getOwnStories();
    break;
    default:
      storyList = storyList;
  }
  return storyList;
}

$('#new-story-form').on("submit", postStory);

async function postStory(e) {
  e.preventDefault();
  let storyData = {
    "author": $('#story-author').val(),
    "title": $('#story-title').val(),
    "url": $('#story-url').val()
  }
  let newStory = await currentUser.addStory(storyData);
  let $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $newStoryForm.trigger("reset");
  return newStory;
}

$allStoriesList.on("click", ".add-fav-btn", addStoryToFavorites)

async function addStoryToFavorites(e) {
  let story = extractStory(e);
  toggleButtonClasses(e.target, story.storyId);
  await currentUser.addFavorite(story);
}

$allStoriesList.on("click", ".rem-fav-btn", removeFromFavorites)

async function removeFromFavorites(e) {
  let story = extractStory(e);
  await currentUser.removeFromFavorites(story);
  if ($body.hasClass("on-favs-page")){
    let $story = $allStoriesList.find(`#${story.storyId}`);
    $story.remove()
  }
  toggleButtonClasses(e.target, story.storyId);
  if (currentUser.favorites.length === 0){
    $favsMessage.show();
  }
}

function extractStory(e){
  const storyId = (e.target.id).slice(4);
  let filterStory = storyList.stories.filter(i => i.storyId === storyId)
  let story = filterStory[0];
  return story;
}

function toggleButtonClasses(button, storyId){
  $(button).toggleClass("add-fav-btn rem-fav-btn");
  $(button).hasClass("add-fav-btn") ? $(button).html("Add Favorite") : $(button).html("Remove Favorite");
  $(button).hasClass("add-fav-btn") ? $(button).attr("id", `fav+${storyId}`) : $(button).attr("id", `rem+${storyId}`);
}




