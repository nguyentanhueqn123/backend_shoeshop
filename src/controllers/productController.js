const { query, response } = require('express');
const productSchema = require('../models/products')
const typeProductSchema = require('../models/typeProducts')

class ProductController {

    async getAllProductType(req,res,next){
        let query = {}

        if (req.query.textSearch) {
            query.nameType = {
                $regex: req.query.textSearch
            }
        }

        try{
            const findProduct = await typeProductSchema.find(query).select()
        res.send(findProduct)
        }catch(err){
            throw new Error(err)
        }

    }
    


    async getProductTypeById(req,res,next){
        try{
        const _id = req.params.id;
        const findProduct = await typeProductSchema.find({"_id": _id })
        res.send(findProduct)
        }catch(err){
            throw new Error(err)
        }
    }

    async getProductFromType(req,res){
        try {
            const findProduct = await productSchema.find(req.query)
            res.send(findProduct)
            console.log(key)
        } catch (error) {
            throw new Error(error)
            console.log(key)
        }

    }

    async findProductFromId(req,res){
        const _id = req.params.id
        try{
        const product = await productSchema.findById(_id)
        res.send(product)
        }catch(err)
        {
            throw new Error(err)
        }
    }


    //Ham lay du lieu tu database
    async getAllProduct(req, res, next) {
        let query = req.query
        let querySort = []


        if (req.query.typeId) {
            query.typeId = {
                $in: req.query.typeId.split(',')
            }
        }

        if (req.query.textSearch) {
            query.nameProduct = {
                $regex: req.query.textSearch
            }
        }

        if (req.query.orderBy && req.query.order) {
            var orderBy, order
            orderBy = req.query.orderBy
            querySort.push(orderBy)
            order = req.query.order === 'asc' ? 1 : -1
            querySort.push(order)
        }

        try {
            const product = await productSchema.find(query).populate('typeId').sort([querySort])
            res.send(product)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }

    async countTypeProductSold(req,res){
        try {
            const findType = await productSchema.aggregate([
                {$match: {status: "SOLD"}},
                {$group:{_id: "$typeId",
                count:{$sum: 1}}},
           
            ])
            res.send(findType)
        } catch (error) {
            throw new Error(error)
        }
    }
    //sort get
    /*
    async getAllProductSortCreateAtIncrease(req, res, next) {
        try {
            const products = await productSchema.find().sort({createAt:1})
            res.send(products)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }



    async getAllProductSortCreateAtDecrease(req, res, next) {
        try {
            const products = await productSchema.find().sort({createAt:-1})
            res.send(products)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }

    async getAllProductSortPriceDecrease(req, res, next) {
        try {
            const products = await productSchema.find().sort({price:-1})
            res.send(products)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }

    async getAllProductSortPriceIncrease(req, res, next) {
        try {
            const products = await productSchema.find().sort({price:1})
            res.send(products)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }
    */
    async sortProduct(req,res){
        const name = req.query.name
        const desc = req.query.desc
        try{
            const sortObject = {}
            sortObject[name] = desc
        

            const products = await productSchema.find().sort(sortObject)
          
            console.log(sortObject)
            res.send(products)
        }
        catch(err){
            throw new Error(err)
        }
    }

    async addTypeProduct(req,res){
        const products = await new typeProductSchema({
            nameType: req.body.nameType,
            note: req.body.note
        })
        try{
            const temp = await products.save()
            res.send(temp)
        }catch(err)
        {
            throw new Error(err)
        }
    }

    async addProduct(req, res) {
        const products = await new productSchema({
            nameProduct: req.body.nameProduct,
            typeId: req.body.typeId,
            price: req.body.price,
            sale: req.body.sale,
            image: req.body.image,
            description: req.body.description,
            metal: req.body.metal,
            size: req.body.size,
            status: req.body.status
        })
        try {
            const temp = await products.save()
            res.json(temp)
        } catch (err) {
            res.send('Error' + err)
        }
    }

    async setProduct(req,res){
        try{
            const _id = req.params.id;
            const updateField = await productSchema.findByIdAndUpdate(_id,req.body)
            res.send(updateField)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }
    
    async setTypeProduct(req,res){
        try{
            const _id = req.params.id;
            const newProductType = await typeProductSchema.findByIdAndUpdate({_id}, req.body)
            res.send(newProductType)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }
    


    async deleteTypeProductById(req,res){
        const id = req.params.id
        try{
        const product = await typeProductSchema.deleteOne({_id: id})
        res.send(product)
        }catch(err)
        {
            throw new Error(err)
        }
    }

    async deleteProductById(req,res){
        const _id = req.params.id
        try{
        const product = await productSchema.findByIdAndDelete(_id)
        res.send(product)
        }catch(err)
        {
            throw new Error(err)
        }
    }


}

module.exports = new ProductController