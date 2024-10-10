import {useEffect, useState, useRef} from 'react'
import { useSocket } from '@/context/SocketContext'
import { getAllChats, createOrGetOneToOneChat,sendMessage, getAllMessages } from '@/api'
import { EllipsisVertical, MessageCirclePlus, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChatInterface, ChatMessageInterface } from '@/types';
import { getChatObjectMetadata } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import AddChatModal from '@/components/modules/AddChatModal';
import { Button } from '@/components/ui/button';
import { FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    const {user} = useAuth()
    const [chats, setChats] = useState<any[]>([])
    const [receiverId, setReceiverId] = useState<string>()
    const [message, setMessage] = useState<string>('')
    const [chatId, setChatId] = useState<string>()
    const [messages, setMessages] = useState<ChatMessageInterface[]>([])
    const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>([])
    const currentChat = useRef<ChatInterface|null>(null)

    const handleOnChatClick = (clickedChat:ChatInterface) =>{
      if(currentChat.current?._id == clickedChat._id) return
      
        setChatId(clickedChat._id)
        currentChat.current = clickedChat
        socket?.emit(JOIN_CHAT_EVENT,  clickedChat._id)
        getAllMessages({chatId:currentChat.current._id})
        .then((res)=>{
            setMessages(res.data.data)
        })

        setUnreadMessages((prev)=>prev.filter((msg)=>msg.chat != clickedChat._id))
    }
    const updateChatLastMessage = (
      chatToUpdateId: string,
      message: ChatMessageInterface // The new message to be set as the last message
    ) => {
      // Search for the chat with the given ID in the chats array
      const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;
  
      // Update the 'lastMessage' field of the found chat with the new message
      chatToUpdate.lastMessageDetails[0] = message;
      // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
  
      // Update the state of chats, placing the updated chat at the beginning of the array
      setChats([
        chatToUpdate, // Place the updated chat first
        ...chats.filter((chat) => chat._id !== chatToUpdateId), // Include all other chats except the updated one
      ]);
    };
    const handleSendMessage = ()=>{
      if(message.length == 0) return
      if(!currentChat.current) return
      sendMessage({chatId:currentChat.current?._id, content:message})
      .then((res)=>{
        console.log(res.data.data)
        socket?.emit(MESSAGE_RECEIVED_EVENT, res.data.data)
        updateChatLastMessage(currentChat.current?._id!, res.data.data)
        if(currentChat.current?._id == res.data.data.chat){          
          setMessages([ ...messages, res.data.data])
        }
        setMessage('')
      })
    }
    const handleReceiveMessage = (data:ChatMessageInterface)=>{
      if(currentChat.current?._id == data.chat){
          setMessages((prev)=>[...prev, data])
      }
      else{
        setUnreadMessages((prev)=>[...prev, data])
      }
      updateChatLastMessage(data.chat, data)


  }
  useEffect(
    ()=>{
      getAllChats()
      .then((res)=>{
        setChats(res.data.data)
        console.log(res.data.data)
      })
    },[]
  )
    useEffect(()=>{
     
        if(socket){
            socket.on(CONNECTED_EVENT,()=>{console.log('connected')})
            socket.on('disconnect', ()=>{console.log('disconnected')})
            socket.on(NEW_CHAT_EVENT, (data)=>{
                setChats([data, ...chats])
            })
            socket.on(MESSAGE_RECEIVED_EVENT, handleReceiveMessage)
            
        }
      return ()=>{
        socket?.off(CONNECTED_EVENT, ()=>{console.log('connected')})
        socket?.off('disconnect', ()=>{console.log('disconnected')})
        socket?.off(NEW_CHAT_EVENT, (data)=>{
            setChats([data, ...chats])
        })
        socket?.off(MESSAGE_RECEIVED_EVENT, handleReceiveMessage)

      }
    },[socket, chats])

  return (
    <div className="w-[85%] md:w-3/4 h-screen flex">
      <div className='w-[30%] h-screen border-0 border-r'>
        <div className='flex justify-between mx-5 mt-2 items-end'>
          <div className="text-3xl font-bold font-sans">Chats</div>
          <AddChatModal setChats={setChats}/>
        </div>
        <div className='w-[90%] mx-auto mt-3'>

      <Input placeholder='Search...'/>
        </div>
        <Separator className='mt-3'/>
        <div className=''>
      {chats.map(
        (chat:ChatInterface)=>{
          const chatDetails = getChatObjectMetadata(chat, user!)
          return(
            <div key={chat._id} onClick={()=>handleOnChatClick(chat)} className={`border-b cursor-pointer hover:bg-muted p-3 ${currentChat.current?._id == chat._id ? 'bg-muted' : unreadMessages.filter((m)=>m.chat == chat._id).length > 0 ? 'bg-green-800' : 'bg-transparent' } }`}>
              <div className="flex justify-between items-center">
                <div className='flex gap-2 items-center justify-start'>
                <div>
                  <img src={chatDetails?.profilePicture} className='w-10 h-10 rounded-full' alt="User profile Picture" />
                </div>
                <div >
                  <div className='font-bold'>{chatDetails?.title}</div>
                  <div className='text-sm text-muted-foreground line-clamp-1'>{chatDetails?.lastMessage}</div>
                </div>
                </div>
                <EllipsisVertical/>
              </div>
            </div>
          )
        }
      )}
        </div>
      </div>
      <div className='w-[70%] flex overflow-y-auto flex-col-reverse'>
        {
          currentChat.current && <div className='w-full'>
            {messages.map((message:ChatMessageInterface)=>{
              return(
                <div key={message._id} className={`w-fit items-center gap-2 p-2 m-1 mx-2 rounded-xl max-w-[55%] overf ${message.sender._id == user?._id ? 'ml-auto flex flex-row-reverse bg-green-800' : 'flex bg-blue-900'}`}>
                    <div className=''>
                      <img src={message.sender.profilePicture} className='w-7 h-7 rounded-full' alt="User profile Picture" />                
                    </div>
                    <div>

                      <Link to={`/user/${message.sender.username}`} className='text-xs hover:underline text-muted-foreground'>{message.sender.username}</Link>
                      <div className='max-w-[20%]'>{message.content}</div>{/*Fix sizing */}
                    </div>
                </div>
              )
            })}
            <div className='relative mb-5 mx-2'>
              
            <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder='Type a message...'/>
            <Button onClick={handleSendMessage} className='absolute bottom-1 right-1'><FaPaperPlane/></Button>
            </div>
            
          </div>
        }
      </div>
    </div>
  )
}

export default Chat
