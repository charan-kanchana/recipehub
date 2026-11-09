const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, deleteFavorite } = require('../controllers/favoriteController');

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:id', deleteFavorite);

module.exports = router;
