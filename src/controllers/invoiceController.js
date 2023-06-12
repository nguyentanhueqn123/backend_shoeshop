const invoiceSchema = require('../models/invoice');
const userSchema = require('../models/user')
const productSchema = require('../models/products');
const invoice = require('../models/invoice');
class InvoiceController {
    

    async getCount(req,res){
        try {
            const findInvoice = await invoiceSchema.aggregate([
                {$group:{_id: "$status",
                count:{$sum: 1}}},
           
            ])
            res.send(findInvoice)
        } catch (error) {
            throw new Error(error)
        }
    }


    async getTotal(req,res){
        try{
            const findInvoice = await invoiceSchema.aggregate([
                    {$group: {_id: "$status" , 
                        total: {$sum: "$cost"}}}
                ])
                res.send(findInvoice)
        }catch(err){
            throw new Error(err)
        }
    }

    
    


    async sortBestSeller(req,res){
        try {
            const findInvoice = await invoiceSchema.aggregate([
                {$group:{_id: "$productId",
                count:{$sum: 1}}
                },
                {$sort: {totalSale:-1}},
                {$limit: 8}
            ])
            res.send(findInvoice)
        } catch (error) {
            throw new Error(error)
        }
    }


    async getAllInvoice(req, res) {
        let query = req.query
        let querySort = []

        if (req.query.status) {
            query.status = req.query.status.toUpperCase()
        }

        if (req.query.textSearch) {
            query.address = {
                $regex: req.query.textSearch
            }
        }

        if(req.query.orderBy && req.query.order) {
            var orderBy, order
            orderBy = req.query.orderBy
            querySort.push(orderBy)
            order = req.query.order === 'asc' ? 1 : -1 
            querySort.push(order)
        }

        try {
            const invoices = await invoiceSchema.find(query).sort([querySort])
            res.send(invoices)
        }
        //.find(query).sort([querySort])
        catch (err) {
            res.send({ message: err.message })
        }
    }

    async getUserId(req,res,next){
        const _id = req.params.id;
        try {
            const findInvoice = await userSchema.find({"userId": _id })
            res.send(findInvoice)
        } catch (error) {
            throw new Error(error)
        }
        
    }

    //Ham lay du lieu tu database
   

    async getInvoiceStatus(req,res){
        try {
            const findStatus = await invoiceSchema.find(req.query)
            res.send(findStatus)
            console.log(req.query)
        } catch (error) {
            throw new Error(error)
        }

    }




    async findInvoiceFromId(req,res){
        const _id = req.params.id
        try{
        const invoice = await invoiceSchema.findById(_id)
        res.send(invoice)
        }catch(err)
        {
            throw new Error(err)
        }
    }
   
    // async addInvoice(req, res) {
    //     const invoices = await new invoiceSchema({
    //         productId: req.body.productId,
    //         userId: req.body.userId,
    //         phone: req.body.phone ,
    //         address: req.body.address,
    //         cost: req.body.cost,
    //         paymemtMethod: req.body.paymemtMethod,
    //         status: req.body.status,
    //         amount: req.body.amount
    //     })
    //     try {
    //         const temp = await invoices.save()
    //         res.json(temp)
    //     } catch (err) {
    //         res.send('Error' + err)
    //     }
    // }
    async addInvoice(req, res) {
        const invoice = new invoiceSchema({
            userId: req.body.userId,
            product: req.body.product,
            phone: req.body.phone,
            address: req.body.address,
            cost: req.body.cost,
            paymemtMethod: req.body.paymemtMethod,
            status: req.body.status,
            amount: req.body.amount
        });
        try {
            const temp = await invoice.save();
            res.json(temp);
        } catch (err) {
            res.send('Error' + err);
        }
    }
    async addProduct(req,res){
        const product = req.body.productId
        const _id = req.params.id
        try {
            const invoice = await invoiceSchema.findById(_id)
            invoice.product.push(product)
            invoice.save()
            res.send(invoice)
        } catch (error) {
            throw new Error(error)
        }
    }

    // async addProduct(req,res){
    //     const product = req.body.productId
    //     const _id = req.params.id
    //     try {
    //         const invoice = await invoiceSchema.findById(_id)
    //         invoice.productId.push(product)
    //         invoice.save()
    //         res.send(invoice)
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }


    async deleteProduct(req,res){
        try{
            const flag = false
        const invoice = await invoiceSchema.findByIdAndUpdate(
            {_id:req.params.id},
            {$pop: {productId:  req.body.productId}})
        res.send(invoice)
        }catch(err)
        {
            throw new Error(err)
        }
    }
    async setInvoice(req,res){
        try{
            const _id = req.params.id;
            const updateField = await invoiceSchema.findByIdAndUpdate(_id,req.body)
            res.send(updateField)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }

    
    async deleteInvoiceFromId(req,res){
        const _id = req.params.id
        try{
        const invoice = await invoiceSchema.findByIdAndDelete(_id)
        res.send(invoice)
        }catch(err)
        {
            throw new Error(err)
        }
    }
   
  
}

module.exports = new InvoiceController