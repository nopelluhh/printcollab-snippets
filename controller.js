const responses = require('../models/responses')
const chatsService = require('../services/chats.service')()

module.exports = chatsController

function chatsController() {
    return {
        archiveConversation,
        getAllConversations,
        getConversationById,
        getCurrentConversation,
        getPagedArchiveConversations,
        getPagedConversations,
        insertMessage,
        getMessagesBySearch
    }

    function archiveConversation(req, res, next) {
        chatsService.archiveConversation(req.params.id)
            .then((conversation) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = conversation
                res.response = responseModel
                next()
            })
            .catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getAllConversations(req, res) {
        chatsService.getAllConversations()
            .then((chats) => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = chats
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getConversationById(req, res) {
        chatsService.getConversationById(req.params.id)
            .then((conversation) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = conversation
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getCurrentConversation(req, res) {
        chatsService.getCurrentConversation(req)
            .then((conversation) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = conversation
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getPagedArchiveConversations(req, res) {
        chatsService.getPagedConversations(req.params, true)
            .then(conversations => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = conversations
                res.json(responseModel)
            })
    }

    function getPagedConversations(req, res) {
        chatsService.getPagedConversations(req.params, false)
            .then(conversations => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = conversations
                res.json(responseModel)
            })
    }

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
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function searchMessages(req, res) {
        chatsService.searchMessages(req)
            .then(result => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = result
                res.json(responseModel)
            }).catch(err => res.json(err))
    }
}