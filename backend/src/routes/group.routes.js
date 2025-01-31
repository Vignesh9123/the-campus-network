import { Router } from "express";
import {
    createGroup,
    getGroup,acceptRequest,addToGroup,deleteGroup,exitFromGroup,isGroupNameUnique,rejectRequest,removeFromGroup,requestToJoinGroup,getMyGroups,groupSuggestedPeople,getGroupForVisitors,updateGroupDetails, changeGroupAdmin
} from '../controllers/group.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route('/create-group').post(createGroup)
router.route('/get-group/:groupId').get(getGroup)
router.route('/accept-request/:userId/:groupId').post(acceptRequest)
router.route('/add-to-group/:userId/:groupId').post(addToGroup)
router.route('/delete-group/:groupId').delete(deleteGroup)
router.route('/exit-from-group/:groupId').post(exitFromGroup)
router.route('/is-group-name-unique').post(isGroupNameUnique)
router.route('/reject-request/:userId/:groupId').post(rejectRequest)
router.route('/remove-from-group/:userId/:groupId').post(removeFromGroup)
router.route('/request-to-join-group/:groupId').post(requestToJoinGroup)
router.route('/get-my-groups').get(getMyGroups)
router.route('/group-suggested-people/:groupId').get(groupSuggestedPeople)
router.route('/get-group-for-visitors/:groupId').get(getGroupForVisitors)
router.route('/update-group-details/:groupId').patch(updateGroupDetails)
router.route('/change-group-admin/:groupId/:userId').patch(changeGroupAdmin)

export default router;
