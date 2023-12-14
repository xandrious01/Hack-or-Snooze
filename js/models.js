"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";


class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    const storyUrl = this.url;
    const splitUrl = storyUrl.toString().split("/");
    const hostname = splitUrl[2];
    return hostname !== undefined ? hostname : '';
  }

}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }


  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET"
    });

    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories);
  }

    addStory(response) {
      const story = new Story(response.data.story);
      this.stories.unshift(story);
      return story;
    }
  
    static getFavorites(){
      return new StoryList(currentUser.favorites);
    }

    static getOwnStories(){
      return new StoryList(currentUser.ownStories);
    }

}


class User {


  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    this.loginToken = token;
  }


  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }


  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;
    let { favorites } = user;
    let favIds = favorites.map(i => i.storyId)
    localStorage.setObj("favorites", favIds);

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;
      let { favorites } = user;
      let favIds = favorites.map(i => i.storyId)
      localStorage.setObj("favorites", favIds);

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async addStory(storyData) {
    const token = this.loginToken;
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { token, story: storyData },
    });
    const story = storyList.addStory(response);
    this.ownStories.push(story);
    return story;
  }

  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add" ? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story)
  }

  async removeFromFavorites(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite("remove", story);
  }
}
