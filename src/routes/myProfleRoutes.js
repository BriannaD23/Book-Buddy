
import express from 'express';
import { updateProfilePic, getUserById ,updateName} from '../controllers/myProfileController.js';  

const router = express.Router();

router.put('/:userId/photoURL', updateProfilePic);
router.get('/:userId', getUserById);
router.put('/:userId/name',updateName)



export default router;