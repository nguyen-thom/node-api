var Joi = require('joi');

var validation = {
    // POST /api/tasks
    createTask: {
        schema:{
            params: {
              }
        }
    },

  
    // GET-PUT-DELETE /api/tasks/:taskId
    getTask: {
        schema:{
            params: {
                id: Joi.number().required().error(new Error("Please input string id")),
              }
        },options: {
            joiOptions: {
              allowUnknown: false
            }
          }
    },
  
    // PUT /api/tasks/:taskId
    updateTask: {
      body: {
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        description: Joi.string(),
        done: Joi.boolean()
      }
    }
  };

module.exports = validation ;