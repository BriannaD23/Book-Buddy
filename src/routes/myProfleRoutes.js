
import express from 'express';
import { updateProfilePic, getUserById } from '../controllers/myProfileController.js';  

const router = express.Router();

router.put('/:userId/photoURL', updateProfilePic);
router.get('/:userId', getUserById);



export default router;