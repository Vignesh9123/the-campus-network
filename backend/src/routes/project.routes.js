import Router from 'express'
import {
    addProject,
    getGroupProjects,
    getMyProjects,
    getProject,
    updateProject,
    deleteProject,
    updateProjectStatus
} from '../controllers/project.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()
router.use(verifyJWT)

router.route('/add-project').post(addProject)
router.route('/get-group-projects/:groupId').get(getGroupProjects)
router.route('/get-my-projects').get(getMyProjects)
router.route('/get-project/:projectId').get(getProject)
router.route('/update-project/:projectId').patch(updateProject)
router.route('/update-project-status/:projectId').patch(updateProjectStatus)

router.route('/delete-project/:projectId').delete(deleteProject)

export default router