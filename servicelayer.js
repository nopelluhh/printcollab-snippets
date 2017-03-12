const Message = require('../models/message')
const Conversation = require('../models/conversation')

module.exports = ChatsService

function ChatsService(options) {
    return {
        archiveConversation,
        getAllConversations,
        getConversationById,
        getCurrentConversation,
        getMessagesBySearch,
        getPagedConversations,
        insertMessage
    }

    function archiveConversation(id) {
        return Conversation.findOneAndUpdate({
            _id: id
        }, {
            archive: true
        })
    }

    function getAllConversations() {
        return Conversation.find().sort('archive read -updated_at')
    }

    function getConversationById(id) {
        return Conversation.findOne({
            _id: id
        }).populate('messages')
    }

    function getCurrentConversation(req) {
        return Conversation.findOne({
            user: req.body.user_id,
            archive: false
        }).populate('messages')
    }

    function getMessagesBySearch(req) {
        return Message.find({
            $text: {
                $search: req.params.searchstring
            }
        }).then((messages) => {
            let messageIds = messages.map(message => message._id)

            return Conversation.find().where('messages').in(messageIds)
        })
    }

    function getPagedConversations(params, archive) {
        let queryCondition = {
            read: params.read,
            archive: archive
        }

        queryCondition.updated_at = params.direction === 'after' ? {
            $lt: params.date
        } : {
            $gt: params.date
        }

        return Conversation.find(queryCondition).sort('-updated_at').limit(Number(params.limit))
    }

    function insertMessage(reqBody) {

        return new Message(reqBody).save()
            .then((res) => {
                let queryCondition = reqBody.conversation_id ? {
                    _id: reqBody.conversation_id
                } : {
                    user: reqBody.user_id,
                    archive: false
                }

                let update = {
                    $push: {
                        messages: res._id
                    },
                    $set: reqBody.rep ? {
                        read: true
                    } : {
                        username: reqBody.room,
                        user: reqBody.user_id,
                        read: false
                    }
                }

                let opts = {
                    upsert: true,
                    setDefaultsOnInsert: true
                }
                return Conversation.findOneAndUpdate(queryCondition, update, opts).exec()
            })
    }
}