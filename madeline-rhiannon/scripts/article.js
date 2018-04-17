'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
//This function needs contextual "this" to work.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // The ? is the ternary if operator. We saw this logic in class yesterday. It has also been in the previous labs.
  //if this.publishedOn exists, load published info, if not, say draft.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called in an if statement below that runs if local storage has rawData in it. The data is located in hackerIpsum.JSON in an array.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}
Article.fetchAll = () => {
  if (localStorage.rawData) {
    let usableData= JSON.parse(localStorage.rawData)
    Article.loadAll(usableData);
    articleView.initIndexPage();
  } else {
    $.getJSON('../data/hackerIpsum.json')
      .then( articleData => {
        Article.loadAll(articleData);
        let stringifiedData = JSON.stringify(articleData);
        localStorage.setItem('rawData', stringifiedData);
        articleView.initIndexPage();
      });
  }
}

Article.fetchAll();