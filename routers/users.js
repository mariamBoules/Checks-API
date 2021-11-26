const express = require('express')
const User = require('../models/users')
const {sendWelcomeMail} = require('../emails/account')
const router = new express.Router()
const auth = require('../auth')


router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeMail(user.email,user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me',auth, async(req,res)=>{
    res.send(req.user)
})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutALL', auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send(e)
    }
})


router.patch('/users/me',auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password']
    const isValidUpdates = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdates){
        return res.status(400).send({Error: 'Updates invalid'})
    }
    try{

        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router