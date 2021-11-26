const express = require('express')
const Check = require('../models/checks')
const auth = require('../auth')
var urlmon = require('url-monitor')
const router = new express.Router()
const {sendURLup, sendURLdown, sendURLerror} = require('../emails/account')


router.post('/checks',auth, async(req,res) =>{
    const check = new Check({
        ...req.body,
        owner: req.user._id
    })

    try{
        await check.save()
        res.status(201).send(check)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/checks', auth, async(req,res)=>{

    try{
        const checks = await Check.find({owner: req.user._id})
        if(!checks){
            res.status(404).send()
        }
        res.send(checks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/checks/:id', auth ,async(req,res)=>{
    const _id = req.params.id

    try{
    const check = await Check.findOne({_id,owner: req.user._id})
    if(!check){
        res.status(404).send()
    }
    res.send(check)}
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/checks/:id',auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','url','protocol','timeout', 'interval']
    const isValidUpdates = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdates){
        return res.status(400).send({Error: 'Updates invalid'})
    }
    try{
        const check = await Check.findOne({_id:req.params.id,owner:req.user._id})

        if(!check){
            res.status(404).send()
        }
        
        updates.forEach((update)=>check[update] = req.body[update])
        await check.save()
        res.send(check)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/checks/:id',auth , async(req,res)=>{
    try{
        const check = await Check.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!check){
            res.status(404).send()
        }
        res.send(check)
    }catch(e){
        res.status(500).send()
    }
})

router.post('/checks/:id', auth, async(req,res)=>{
    try{
        const check = await Check.findOne({_id:req.params.id,owner:req.user._id})
        if (!check){
            res.status(404).send()
        }
        const url =  check.protocol +"://" + check.url
        var website = new urlmon({
            url: url, 
            interval: check.interval,
            timeout: check.timeout
        });
        website.on('error', (data) => {
            website.stop();
            sendURLerror(req.user.email, req.user.name, url)
            res.send(data)
        })
         
        website.on('available', (data) => {
            sendURLup(req.user.email, req.user.name, url)
            res.send(data)
        })
         
        website.on('unavailable', (data) => {
            sendURLdown(req.user.email, req.user.name, url)
            res.send(data)
            website.stop();
        })
        website.start();
        
    }catch(e){
        res.status(500).send()
    }
})
module.exports = router