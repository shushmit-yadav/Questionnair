/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'POST /question'                : 'QuestionController.addQuestion',
  'PUT /question'                 : 'QuestionController.updateQuestion',
  'POST /tag'                     : 'QuestionCOntroller.addOrRemoveTag',
  'GET /questions/:tag'           : 'QuestionController.questionsByTag',
  'GET /question/:id'             : 'QuestionController.getQuestion'

};
