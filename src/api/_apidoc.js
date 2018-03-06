// to keep all error definitions and API history

/**
 * @apiDefine UserNotFound
 * @apiError (404) UserNotFound The id was not found.
 * @apiErrorExample {json} Error (example):
 *   { "error": "UserNotFound" }
 */

/**
 * @apiDefine RoleNotFound
 * @apiError (404) RoleNotFound The id was not found.
 * @apiErrorExample {json} Error (example):
 *   { "error": "RoleNotFound" }
 */

/**
 * @api {post} /roles Add role
 * @apiVersion 0.8.0
 * @apiName AddRole
 * @apiGroup Role
 * @apiParam (Body) {String} name role tag.
 * @apiSuccessExample {json} Success (example):
 *   { "message": "ok" }
 */
