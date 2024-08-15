//const asyncHandler = require("express-async-handler");
import expressAsyncHandler from "express-async-handler";

//exports.index = expressAsyncHandler(async (req, res, next) => {
//  /*  #swagger.tags = ['User']
//      #swagger.description = 'get all users.' */
//  res.send('Users');
//}
//);
//
//exports.create = expressAsyncHandler(async (req, res, next) => {
///*  #swagger.tags = ['User'] 
//    #swagger.description = 'Create user.' */
//  res.send('Create User');
//}
//);
//
//exports.byId = expressAsyncHandler(async (req, res, next) => {
///* #swagger.tags = ['User'] 
//   #swagger.description = 'Endpoint to get the specific user.' */
//    res.send('Get User by Id');
//}
//);

export default class UserController {
  async byId(req, res, next) {
  /* #swagger.tags = ['User'] 
     #swagger.description = 'Endpoint to get the specific user.' */
    res.send('Get User by Id');
  }

   async index(req, res, next) {
    /*  #swagger.tags = ['User']
        #swagger.description = 'get all users.' */
    res.send('Users');
  }

  async create(req, res, next) {
  /*  #swagger.tags = ['User'] 
      #swagger.description = 'Create user.' */
    res.send('Create User');
  }
}

