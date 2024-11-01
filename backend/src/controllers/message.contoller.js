import mongoose from "mongoose";
import { ChatMessage } from "../models/message.model.js";
// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { Chat } from "../models/chat.model.js";
const chatMessageCommonAggregation = () => {
    return [
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "sender",
          as: "sender",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                profilePicture: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          sender: { $first: "$sender" },
        },
      },
    ];
};

const getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    if(!chatId){
        throw new ApiError(400, "Chat id is required");
    }
    const chat = await Chat.findById(chatId);
    if(!chat){
        throw new ApiError(404, "Chat not found");
    }
    if(!chat.participants.includes(req.user._id)){
        throw new ApiError(403, "You are not authorized to access this chat");
    }
    const chatMessages = await ChatMessage.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatMessageCommonAggregation(),
      {
        $sort: {
          createdAt:1
        },
      }
    ]);
    if (!chatMessages.length) {
      throw new ApiError(402, "No chat messages found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, chatMessages, "Chat messages fetched successfully"));
});


const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const {content} = req.body;
    if(!chatId){
        throw new ApiError(400, "Chat id is required");
    }
    if(!content){
        throw new ApiError(400, "Message content is required");
    }

    const chatMessage = await ChatMessage.create({
        sender: req.user._id,
        chat: chatId,
        content
    });

    const chat = await Chat.findByIdAndUpdate(chatId, {
        lastMessage: chatMessage._id,
    },
    {
        new: true
    })
    const chatMessages = await ChatMessage.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(chatMessage._id),
            },
        },
        ...chatMessageCommonAggregation(),
    ]);
    if (!chatMessages.length) {
        throw new ApiError(404, "No chat messages found");
    }
    const receivedMessage = chatMessages[0];

    chat.participants.forEach((participant) => {
        if (participant._id.toString() !== req.user._id.toString()) {
            emitSocketEvent(
                req,
                participant._id?.toString(),
                ChatEventEnum.MESSAGE_RECEIVED_EVENT,
                receivedMessage
            );
        }
    });
    return res.status(201).json(new ApiResponse(201, receivedMessage, "Message sent successfully"));
})

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    if(!messageId){
        throw new ApiError(400, "Message id is required");
    }
    const message = await ChatMessage.findById(messageId);
    if(!message){
        throw new ApiError(404, "Message not found");
    }
    if(!(message.sender.toString() === req.user._id.toString())){
        throw new ApiError(403, "You are not authorized to delete this message");
    }
    const deletedMessage = await ChatMessage.findByIdAndDelete(messageId);
    const chat = await Chat.findById(deletedMessage.chat);
    if(chat.lastMessage.toString() == deletedMessage._id.toString()){
      const lastMessage = await ChatMessage.find({chat: chat._id}).sort({createdAt: -1})
      chat.lastMessage = lastMessage[0]._id;
      await chat.save();
    }
    chat.participants.forEach((participant) => {
        if (participant._id.toString() !== req.user._id.toString()) {
            emitSocketEvent(
                req,
                participant._id?.toString(),
                ChatEventEnum.MESSAGE_DELETE_EVENT,
                deletedMessage
            );
        }
    });
    return res.status(200).json(new ApiResponse(200, deletedMessage, "Message deleted successfully"));
})


export {sendMessage, getChatMessages, deleteMessage};