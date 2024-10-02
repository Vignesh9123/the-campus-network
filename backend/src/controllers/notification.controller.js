import firebase from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' with {type:'json'} //TODO:Encrypt this
import {asyncHandler} from '../utils/asyncHandler.js'
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
})
import {User} from '../models/user.model.js'
const sendNotification = asyncHandler(async (req, res) => {
  const { title, body } = req.body
  const user = req.user
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: user.deviceTokens,
  }
  await firebase.messaging().sendEachForMulticast(message)
  res.status(200).json({ message: 'Notification sent successfully' })
})

const sendNotificationToTopic = asyncHandler(async (req, res) => {
  const { title, body, topic } = req.body
  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: topic,
  }
  await firebase.messaging().send(message)
  res.status(200).json({ message: 'Notification sent successfully' })
})

const sendNotificationToUser = asyncHandler(async (req, res) => {
  const { title, body, userId } = req.body
  const user = await User.findById(userId)
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: user.deviceTokens,
  }
  await firebase.messaging().sendEachForMulticast(message)
  res.status(200).json({ message: 'Notification sent successfully' })
})



const storeDeviceToken = asyncHandler(async (req, res) => {
  const { token } = req.body
  const user = req.user
  user.deviceTokens.push(token)
  await user.save({validateBeforeSave:false})
  const message = {
    notification: {
      title: "Welcome",
      body: "Thank you, for enabling the notifications for our app",
    },
    tokens: user.deviceTokens,
  }
  await firebase.messaging().sendEachForMulticast(message)
  res.status(200).json({ message: 'Device token stored successfully' })
})
export { sendNotification,storeDeviceToken,sendNotificationToTopic,sendNotificationToUser }
