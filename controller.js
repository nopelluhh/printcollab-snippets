const responses = require('../models/responses')
const chatsService = require('../services/chats.service')()

module.exports = chatsController

function chatsController() {
    return {
        getAllConversations,
        getConversationById,
        getCurrentConversation,
        getPagedArchiveConversations,
        getPagedConversations,
        getMessagesBySearch,

        // chat middleware 
        archiveConversation,
        insertMessage
    }


    function getAllConversations(req, res) {
        chatsService.getAllConversations()
            .then(chats => itemsResponse(chats, res))
            .catch(err => errorResponse(err, res))
    }

    function getConversationById(req, res) {
        chatsService.getConversationById(req.params.id)
            .then(conversation => itemResponse(conversation, res))
            .catch(err => errorResponse(err, res))
    }

    function getCurrentConversation(req, res) {
        chatsService.getCurrentConversation(req)
            .then(conversation => itemResponse(conversation, res))
            .catch(err => errorResponse(err, res))
    }

    function getPagedArchiveConversations(req, res) {
        chatsService.getPagedConversations(req.params, true)
            .then(conversations => itemsResponse(conversations, res))
            .catch(err => errorResponse(err, res))
    }

    function getPagedConversations(req, res) {
        chatsService.getPagedConversations(req.params, false)
            .then(conversations => itemsResponse(conversations, res))
            .catch(err => errorResponse(err, res))
    }

    function searchMessages(req, res) {
        chatsService.searchMessages(req)
            .then(result => itemsResponse(result, res))
            .catch(err => errorResponse)
    }

    // chat pass through functions

    function insertMessage(req, res, next) {
        if (req.body.image === true) {
            return next()
        }
        chatsService.insertMessage(req.body)
            .then((result) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = result
                res.response = responseModel
                next()
            })
            .catch(err => errorResponse(err, res))
    }

    function archiveConversation(req, res, next) {
        chatsService.archiveConversation(req.params.id)
            .then((conversation) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = conversation
                res.response = responseModel
                next()
            })
            .catch(err => errorResponse(err, res))
    }

    // response formatting 

    function itemResponse(result, response) {
        const responseModel = new responses.ItemResponse()
        responseModel.item = result
        res.json(responseModel)
    }

    function itemsResponse(result, response) {
        const responseModel = new responses.ItemsResponse()
        responseModel.items = result
        res.json(responseModel)
    }

    function errorResponse(error, response) {
        res.status(500).send(new responses.ErrorResponse(err))
    }
}