const couponSchema = require('../models/coupons')

class CouponController{
    
    async getAllQuery(req,res){
        let query = req.query
        if (req.query.status) {
            query.status = req.query.status.toUpperCase()
        }
        if(req.query.textSearch) {
            query.name = {
                $regex: req.query.textSearch
            }
        }

        try {
            const find = await couponSchema.find(query)
            res.send(find)
        } catch (error) {
            throw new Error(err)
        }
    }

    async findCouponByCode(req,res){
        const code = req.params.code
        try{
        const coupon = await couponSchema.find({code})
        res.send(coupon)
        }catch(err)
        {
            throw new Error(err)
        }
    }

    async findCouponById(req, res) {
        const _id = req.params.id
        try {
            const coupon = await couponSchema.find({ _id })
            res.send(coupon)
        } catch (err) {
            throw new Error(err)
        }
    }

    /*
    
    
    
    POST
    
    
    
    
    
    */
    async addCoupon(req,res){
        const coupons = await new couponSchema({
            name: req.body.name,
            value: req.body.value,
            amount:req.body.amount,
            code: req.body.code,
            endDate:req.body.endDate,
        })
        try {
            const temp = await coupons.save()
            res.send(temp)
        } catch (err) {
            throw new Error(err)
        }
    }


    /* 
    
    
        PATCH
    
    
    
    
    */
    async setCoupon(req,res){
        try{
            const _id = req.params.id;
            const updateField = await couponSchema.findByIdAndUpdate(_id,req.body)
            res.send(updateField)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }

    /*
    DELETE    
    */
    async deleteCoupon(req,res){
        const _id = req.params.id
        try {
            const coupon = await couponSchema.findByIdAndDelete(_id)
            res.send(coupon)
        } catch (err) {
            throw new Error(err)
        }
    }

}
module.exports = new CouponController