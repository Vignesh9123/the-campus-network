import React, {useEffect, useState, useRef} from 'react'
import { useSocket } from '@/context/SocketContext'
import { getAllChats,sendMessage, getAllMessages, deleteMessage, deleteChat } from '@/api'
import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChatInterface, ChatMessageInterface } from '@/types';
import { getChatObjectMetadata, requestHandler } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import AddChatModal from '@/components/modules/AddChatModal';
import { Button } from '@/components/ui/button';
import { FaPaperPlane } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import Loader from '@/components/Loader';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,

} from '@/components/ui/dropdown-menu'
import { ChatEventEnums } from '@/constants';
import MobileUserNavbar from '@/components/sections/MobileUserNavbar';


const MESSAGE_LENGTH_LIMIT = 100
function Chat() {
    const {socket} = useSocket()
    const navigate = useNavigate()
    const {user} = useAuth()
    const [chats, setChats] = useState<any[]>([])
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<ChatMessageInterface[]>([])
    const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>([])
    const currentChat = useRef<ChatInterface|null>(null)
    const [selectedMessage, setSelectedMessage] = useState('')
    const [isContextOpen, setIsContextOpen] = useState(false)
    const [chatsSearch, setChatsSearch] = useState<string>('')
    const [chatsLoading, setChatsLoading] = useState(false)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const scrollableDiv = useRef<HTMLDivElement>(null);
    

    const handleCopyMessage = (message:string)=>{
      navigator.clipboard.writeText(message)
    }

    const handleViewProfile = (username:string)=>{
      navigate(`/user/${username}`)
    }

    const handleDeleteChat = (e:React.MouseEvent,chat:ChatInterface)=>{
      e.stopPropagation()
      if(currentChat.current?._id == chat._id) currentChat.current = null
      deleteChat({chatId: chat._id}).then(()=>{
        setChats((prev)=>prev.filter(c=>c._id != chat._id))
      }
      )
    }

    const handleOnChatClick = (clickedChat:ChatInterface) =>{
      if(currentChat.current?._id == clickedChat._id) return
        setMessages([])
        currentChat.current = clickedChat
        setMessagesLoading(true)
        socket?.emit(ChatEventEnums.JOIN_CHAT_EVENT,  clickedChat._id)
        getAllMessages({chatId:currentChat.current._id})
        .then((res)=>{
            setMessages(res.data.data)
            setMessagesLoading(false)
        })
        .catch((err)=>{
            console.log(err)
            setMessagesLoading(false)
        })

        setUnreadMessages((prev)=>prev.filter((msg)=>msg.chat != clickedChat._id))
    }

    const updateChatLastMessageOnDeletion = (
      chatToUpdateId: string, //ChatId to find the chat
      message: ChatMessageInterface //The deleted message
    ) => {
      // Search for the chat with the given ID in the chats array
      const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;
      console.log("chat to update",chatToUpdate)
      console.log("message", message)
      //Updating the last message of chat only in case of deleted message and chats last message is same
      if (chatToUpdate.lastMessage === message._id) {
        requestHandler(
          async () => getAllMessages({ chatId: chatToUpdate._id }),
          null,
          (req) => {
            const { data } = req;
            console.log(data)
            chatToUpdate.lastMessageDetails[0] = data[data.length - 1];
            chatToUpdate.lastMessage = data[data.length - 1]._id;
            setChats([...chats]);
          },
          alert
        );
      }
    };
    
    const updateChatLastMessage = (
      chatToUpdateId: string,
      message: ChatMessageInterface // The new message to be set as the last message
    ) => {
      // Search for the chat with the given ID in the chats array
      const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;
      // Update the 'lastMessage' field of the found chat with the new message
      chatToUpdate.lastMessageDetails[0] = message;
      chatToUpdate.lastMessage = message._id
      // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
      console.log("Updated chat: ", chatToUpdate)
      console.log("Updated message: ", message)
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
        socket?.emit(ChatEventEnums.MESSAGE_RECEIVED_EVENT, res.data.data)
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
  const handleDeleteMessage = (messageId:string)=>{
    const message = messages.find((msg)=>msg._id == messageId)
    deleteMessage({messageId})
    .then((res)=>{
      console.log(res.data.data)
      // socket?.emit(MESSAGE_DELETE_EVENT, res.data.data)
      if(currentChat.current?._id == res.data.data.chat){
        setMessages((prev)=>prev.filter((msg)=>msg._id != messageId))
      }
      updateChatLastMessageOnDeletion(message?.chat!, message!)
    })
  }
  
  const handleDeleteMessageEvent = (message:ChatMessageInterface)=>{
      setMessages((prev)=>prev.filter((msg)=>msg._id != message._id))
    
    setUnreadMessages((prev)=>prev.filter((msg)=>msg._id != message._id))
    updateChatLastMessageOnDeletion(message?.chat!, message!)
  
  }
  const handleLeaveChat = (chat:ChatInterface)=>{
    if(currentChat.current?._id == chat._id){
      currentChat.current = null
      setMessages([])
    }
    setChats((prev)=>prev.filter((c)=>c._id != chat._id))
  }
  
  useEffect(
    ()=>{
      setChatsLoading(true)
      getAllChats()
      .then((res)=>{
        setChats(res.data.data)
        setChatsLoading(false)
        console.log(res.data.data)
      })
    },[]
  )
    useEffect(()=>{
     
        if(socket){
            socket.on(ChatEventEnums.CONNECTED_EVENT,()=>{console.log('connected')})
            socket.on(ChatEventEnums.DISCONNECT_EVENT, ()=>{console.log('disconnected')})
            socket.on(ChatEventEnums.NEW_CHAT_EVENT, (data)=>{
                setChats([data, ...chats])
            })
            socket.on(ChatEventEnums.MESSAGE_RECEIVED_EVENT, handleReceiveMessage)
            socket.on(ChatEventEnums.MESSAGE_DELETE_EVENT, handleDeleteMessageEvent)
            socket.on(ChatEventEnums.LEAVE_CHAT_EVENT, handleLeaveChat)
            
          }
          return ()=>{
            socket?.off(ChatEventEnums.CONNECTED_EVENT, ()=>{console.log('connected')})
            socket?.off(ChatEventEnums.DISCONNECT_EVENT, ()=>{console.log('disconnected')})
            socket?.off(ChatEventEnums.NEW_CHAT_EVENT, (data)=>{
              setChats([data, ...chats])
            })
            socket?.off(ChatEventEnums.MESSAGE_RECEIVED_EVENT, handleReceiveMessage)
            socket?.off(ChatEventEnums.MESSAGE_DELETE_EVENT, handleDeleteMessageEvent)
            socket?.off(ChatEventEnums.LEAVE_CHAT_EVENT, handleLeaveChat)

      }
    },[socket, chats])

  return (
    <div className="w-full md:w-3/4 h-screen flex">
      <div className={`md:w-[30%] md:block h-screen border-0 border-r ${currentChat.current?'hidden':'w-full block'}` }>
        <MobileUserNavbar scrollableDiv={scrollableDiv}/>
        <div className='flex justify-between mx-5 mt-2 items-end'>
          <div className="text-3xl font-bold font-sans">Chats</div>
          <AddChatModal chats={chats} setChats={setChats}/>
        </div>
        <div className='w-[90%] mx-auto mt-3'>

      <Input value={chatsSearch} onChange={(e)=>setChatsSearch(e.target.value)} placeholder='Search...'/>
        </div>
        <Separator className='mt-3'/>
        <div ref={scrollableDiv} className='w-full h-[80vh] overflow-y-auto'>
          {chatsLoading && <Loader/>}
      {chats
      .filter((chat)=>getChatObjectMetadata(chat, user!)?.title?.toLowerCase().includes(chatsSearch.toLowerCase()))
      .map(
        (chat:ChatInterface)=>{
          const chatDetails = getChatObjectMetadata(chat, user!)
          return(
            <div key={chat._id} onClick={()=>handleOnChatClick(chat)} className={`border-b max-w-full  cursor-pointer hover:bg-muted p-3 ${currentChat.current?._id == chat._id ? 'bg-muted' : unreadMessages.filter((m)=>m.chat == chat._id).length > 0 ? 'bg-green-800' : 'bg-transparent' } }`}>
              <div className="flex justify-between items-center w-full px-3">
                <div className='flex gap-2 items-center justify-start max-w-full'>
                <div className='min-w-fit'>
                  <img src={chatDetails?.profilePicture} className='w-10 h-10  rounded-full' alt="User profile Picture" />
                </div>
                <div className='max-w-[70%]'>
                  <div className='font-bold'>{chatDetails?.title}</div>
                  <div className='text-sm text-muted-foreground line-clamp-1 max-w-[]'>{chatDetails?.lastMessage}</div>
                </div>
                </div>
                <div>
              <DropdownMenu>
              <DropdownMenuTrigger>

                <EllipsisVertical className='min-w-fit'/>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={()=>handleViewProfile(chatDetails?.title!)}>View Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
               
                <DropdownMenuItem onClick={(e)=>handleDeleteChat(e,chat)}>Delete</DropdownMenuItem>
             
              </DropdownMenuContent>
              </DropdownMenu>
                </div>
              </div>
            </div>
          )
        }
      )}
        </div>
      </div>
      <div className={`${currentChat.current && currentChat.current._id?'block w-[100%]':'hidden w-0'}  md:w-[70%] flex overflow-y-auto flex-col-reverse`}>
        <div className='fixed top-0 z-50 w-full'>
          {currentChat.current && <div className='flex gap-3 items-center w-full p-3 bg-muted'>
            <div className=''>
              <Button onClick={
                ()=>{
                  currentChat.current = null;
                  setMessages([]);
                }
              } variant={"ghost"} className=''>
                <ArrowLeft />
              </Button>
            </div>
            <div className='min-w-fit'>
              <img src={getChatObjectMetadata(currentChat.current, user!)?.profilePicture} className='w-10 h-10  rounded-full' alt="User profile Picture" />
            </div>
            <div className='max-w-[70%]'>
              <Link to={`/user/${getChatObjectMetadata(currentChat.current, user!)?.title}`} className='font-bold hover:underline'>{getChatObjectMetadata(currentChat.current, user!)?.title}</Link>
            </div>
           
          </div>}
        </div>
        {
          currentChat.current && <div className='w-full mt-16'>
            {messagesLoading && <div className='flex justify-center items-center'>
              <div className='animate-spin rounded-full my-auto h-32 w-32 border-b-2 border-gray-800'></div>
              </div>}
            {messages.map((message:ChatMessageInterface)=>{
              return(
                <ContextMenu modal={isContextOpen} onOpenChange={()=>{
                  setIsContextOpen(!isContextOpen)
                  setSelectedMessage(message._id)

                }}>
                  <ContextMenuTrigger>

                <div key={message._id} className={`w-fit  items-center gap-2 p-2 m-1 mx-2 rounded-xl max-w-[55%] ${message.sender._id == user?._id ? `ml-auto flex flex-row-reverse duration-250 ${(selectedMessage == message._id && isContextOpen)? 'bg-green-950' : 'bg-green-800'}` : `flex ${(selectedMessage == message._id && isContextOpen)?'bg-indigo-950':'bg-blue-900'}`}`}>
                    <div className='min-w-fit'> {/*Darken if selected */}
                      <img src={message.sender.profilePicture} className='w-7 h-7 min-w-fit rounded-full' alt="User profile Picture" />                
                    </div>
                    <div className='max-w-[90%]'>

                      <Link to={`/user/${message.sender.username}`} className='text-xs hover:underline text-muted dark:text-muted-foreground'>{message.sender.username == user?.username ? 'You' : message.sender.username}</Link>
                      <div className='w-full break-words text-white'>{message.content}</div>{/*Fix sizing */}
                      <div className='text-xs text-accent-foreground dark:text-muted-foreground'>{new Date(message.createdAt).toLocaleString(
                        'en-IN', {
                        day:'numeric',
                        month: 'short',
                        year: '2-digit',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      }
                      )}</div>
                    </div>
                </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className='md:w-64'>
                    <ContextMenuItem onClick={()=>handleCopyMessage(message.content)}>Copy</ContextMenuItem>
                    <ContextMenuSeparator/>
                    <ContextMenuItem className={`${message.sender._id == user?._id ? 'text-red-500' : 'hidden'}`} onClick={()=>handleDeleteMessage(message._id)}> Delete Message</ContextMenuItem>
                 
                  </ContextMenuContent>
                </ContextMenu>

              )
            })}
            <div className='lg:hidden text-center text-muted text-xs'>Press and hold to select a message</div>
            <div className='sticky bottom-2 my-2 mx-2 bg-background flex items-center'>
              <div className='w-full'>

            <Input maxLength={MESSAGE_LENGTH_LIMIT} onKeyDown={(e)=>{if(e.key == 'Enter') handleSendMessage()}} value={message} className={`${message.length == MESSAGE_LENGTH_LIMIT ? 'border-red-500' : ''}`} onChange={(e)=>setMessage(e.target.value)} placeholder='Type a message...'/>
              </div>
              <div className='min-w-fit text-xs text-muted-foreground'>
                <span className={` ${message.length >= MESSAGE_LENGTH_LIMIT - 10 ? 'text-red-500' : 'text-green-500'}`}>{message.length}</span>/{MESSAGE_LENGTH_LIMIT}
              </div>
            <Button disabled={message.length == 0 || message.length > MESSAGE_LENGTH_LIMIT} onClick={handleSendMessage} ><FaPaperPlane/></Button>
            </div>
            
          </div>
        }
      </div>
    </div>
  )
}

export default Chat
