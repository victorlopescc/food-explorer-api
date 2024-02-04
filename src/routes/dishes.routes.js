const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const Controller = require('../controllers/DishesController');
const authenticated = require('../middlewares/authenticated');
const admin = require('../middlewares/admin');

const upload = multer(uploadConfig.MULTER);

const dishes = Router();
const dishesController = new Controller();

dishes.use(authenticated);

dishes.post('/', admin, upload.single('image'), dishesController.create);
dishes.get('/', dishesController.index);
dishes.get('/:id', dishesController.show);
dishes.patch('/:id', admin, upload.single('image'), dishesController.update);
dishes.delete('/:id', admin, dishesController.delete);

module.exports = dishes;