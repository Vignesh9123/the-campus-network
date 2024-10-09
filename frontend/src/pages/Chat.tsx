import {useEffect, useState} from 'react'
import { useSocket } from '@/context/SocketContext'
import { getAllChats, createOrGetOneToOneChat,sendMessage } from '@/api'

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_DELETE_EVENT = "messageDeleted";
function Chat() {
    const {socket} = useSocket()
    const [chats, setChats] = useState<any[]>([])
    const [receiverId, setReceiverId] = useState<string>()
    const [message, setMessage] = useState<string>('')
    const [chatId, setChatId] = useState<string>()
    useEffect(()=>{
        if(socket){
            socket.on('connect',()=>{console.log('connected')})
            socket.on('disconnect', ()=>{console.log('disconnected')})
            socket.on(NEW_CHAT_EVENT, (data)=>{
                console.log('new chat', data)
            })
            socket.on(MESSAGE_RECEIVED_EVENT, (data)=>{
                console.log('message received', data)
            })
            
        }
    },[socket])

  return (
    <div>
      Chat
      <input  type="text" placeholder='receiverId' className='text-black' value={receiverId} onChange={(e)=>{setReceiverId(e.target.value)}}/>
      <button onClick={()=>{createOrGetOneToOneChat({receiverId})}}>Create Chat</button>
      <button onClick={()=>{getAllChats()}}>Get All Chats</button>

      <input  type="text" placeholder='message' className='text-black' value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
      <input  type="text" placeholder='chatId' className='text-black' value={chatId} onChange={(e)=>{setChatId(e.target.value)}}/>
      <button onClick={()=>{sendMessage({content:message,chatId})}}>Send Message</button>


    </div>
  )
}

export default Chat
