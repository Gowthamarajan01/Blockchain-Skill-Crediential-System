const express = require('express');
const router = express.Router();
const { issueCredential, getMyCredentials, getAllCredentials, verifyCredential, deleteCredential } = require('../controllers/credentialController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/issue').post(protect, admin, issueCredential);
router.route('/upload-certificate').post(protect, admin, upload.single('certificateImage'), issueCredential);
router.route('/my').get(protect, getMyCredentials);
router.route('/').get(protect, admin, getAllCredentials);
router.route('/verify/:idOrHash').get(verifyCredential);
router.route('/:credentialId').delete(protect, admin, deleteCredential);

module.exports = router;
