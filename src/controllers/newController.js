const newSchema = require('../models/new')

class NewController {
    

    async getAllNew(req, res, next) {
        try {
            const news = await newSchema.find()
            res.send(news)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }

    
    async addNew(req, res) {
        const news = await new newSchema({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
        })
        try {
            const temp = await news.save()
            res.json(temp)
        } catch (err) {
            res.send('Error' + err)
        }
    }
    async setNew(req,res){

        try{
            const _id = req.params.id;
            const updateField = await newSchema.findByIdAndUpdate(_id,req.query)
            res.send(updateField)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }
    async deleteNewFromId(req,res){
        const _id = req.params.id
        try{
        const user = await newSchema.findByIdAndDelete(_id)
        res.send(user)
        }catch(err)
        {
            throw new Error(err)
        }
    }
    async findNewFromId(req,res){
        const _id = req.params.id
        try{
        const news = await newSchema.findById(_id)
        res.send(news)
        }catch(err)
        {
            throw new Error(err)
        }
    }
  
}

module.exports = new NewController