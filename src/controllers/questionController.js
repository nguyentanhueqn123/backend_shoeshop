const questionSchema = require('../models/questions')

class QuestionCotroller {

        //Ham lay du lieu tu database
    async getAllQuestion(req, res, next) {
        try {
            const question = await questionSchema.find().populate({
                path:'userId',
                select:'nameAccount'
            },)
            res.send(question)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }
    async addQuestion(req, res) {
        const questions = await new questionSchema({
            productId: req.body.productId,
            userId: req.body.userId,
            question: req.body.question,
        })
        try {
            const temp = await questions.save()
            res.json(temp)
        } catch (err) {
            res.send('Error' + err)
        }
    }

    async setQuestion(req,res){
        try{
            const _id = req.params.id;
            const updateField = await questionSchema.findByIdAndUpdate(_id,req.body)
            res.send(updateField)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }
    
    async deleteQuestionFromId(req,res){
        const _id = req.params.id
        try{
        const user = await questionSchema.findByIdAndDelete(_id)
        res.send(user)
        }catch(err)
        {
            throw new Error(err)
        }
    }
   
    async getQuestionByIdProduct(req, res, next) {
        try {
            const _id = req.params.id;
            const findQuestion = await questionSchema.find({ "productId": _id }).populate({
                path: 'userId',
                select: 'nameAccount'
            })
            res.send(findQuestion)
        } catch (err) {
            throw new Error(err)
        }
    }

    
    async findQuestionFromId(req,res){
        const _id = req.params.id
        try{
        const question = await questionSchema.findById(_id)
        res.send(question)
        }catch(err)
        {
            throw new Error(err)
        }
    }
}
module.exports = new QuestionCotroller