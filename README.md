# on-surity-questionnair

Questionnair is a platform where user can submit their questions. He can tag his posted question. User can filter questions by tag, submit answers for any question.

## Requirement
+ node - install node 
+ Sails.js - run command ** npm install sails -g **
+ mongodb

## Installation

Unzip folder or clone [Questionnair](https://github.com/shushmit-yadav/Questionnair.git)

Open terminal and navigate to project root directory and then do

+ npm install

npm install will install all the libraries from package.json file.

Once installation done, then to start server, do
+ sails lift

## APIs
+ POST /question
    + Body Parameters keys
        + name - required
        + description
        + tag
+ PUT /question
     + Body Parameters keys
        + questionId - required
        + name 
        + description
+ POST /question/:id/tag
     + Query parameter
        + id
     + Body Parameters
        + tag
+ GET /questions/:tag
     + Query param
        + tag
GET /question/:id
