const express = require('express');
const controllers = require('./../controllers/courseController');

const router = express.Router();

router.route('/best-ratings').get(controllers.getBestRatings);
router.route('/best-seller').get(controllers.getBestSeller);

router.route('/').get(controllers.getAllCourses).post(controllers.createCourse);

router
  .route('/:id')
  .get(controllers.getCourse)
  .patch(controllers.updateCourse)
  .delete(controllers.deleteCourse);

module.exports = router;
