'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
//This function needs contextual "this" to work.
Article.prototype.toHtml = function () {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // The ? is the ternary if operator. We saw this logic in class yesterday. It has also been in the previous labs.
  //if this.publishedOn exists, load published info, if not, say draft.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called in an if statement below that runs if local storage has rawData in it. The data is located in hackerIpsum.JSON in an array.
Article.loadAll = articleData => {
  console.log('articledata', articleData);
  articleData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage? Below. It is a task for us!
  if (localStorage.rawData) {
    let usableData = JSON.parse(localStorage.rawData)
    Article.loadAll(usableData);
    //also needs to be called here if already in local storage.
    articleView.initIndexPage();
  } else {
    //first, we got the JSON from the hackerIpsum
    $.getJSON('../data/hackerIpsum.json')
      //then, when that is complete, load the articleData, using the constructor
      .then(articleData => {
        Article.loadAll(articleData);
        //put in local storage. Needs to be stringified because currently the data is an array that itself is not stringified even though the objects inside it are.
        let stringifiedData = JSON.stringify(articleData);
        localStorage.setItem('rawData', stringifiedData);
        //this line needs to go here so it only happens once there is data that it can access.
        articleView.initIndexPage();
      });
  }
}
