/**
* Uploaded_images.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

        path: {
            type: 'string',
            required: true
        },
        user_id: {
            type: 'integer',
            required: true
        },
         title: {
            type: 'string',
            required: true
        },
         description: {
            type: 'string',
            required: false
        },
  }
};

