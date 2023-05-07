const userModel = require('../models/user')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const user = require('../models/user')
class UserController {


    /*
    //Ham lay du lieu tu database
    async getAllUser(req, res, next) {
        try {
            const user = await userModel.find()
            res.send(user)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }
    // Ham them user vao database, trong do chi can them username vs password la dc, isTeacher va isSelect tu dong la false
    async addUser(req, res) {
        const user = await new userModel({
            nameAccount: req.body.nameAccount,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
        })
        try {
            const temp = await user.save()
            res.json(temp)
        } catch (err) {
            res.send('Error' + err)
        }
    }

    */



    async getUser(req, res) {
        try {
            const user = await userModel.findById(req.userId).select('-password')
            if (!user)
                return res.status(400).json({ success: false, message: 'User not found' })
            res.json({ success: true, user })
        } catch (error) {
            throw new Error(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    async getAllUser(req, res, next) {

        let query = req.query
        if (req.query.role) {
            query.role = req.query.role.toUpperCase().split(',')
        }

        if (req.query.textSearch) {
            query.nameAccount = {
                $regex: req.query.textSearch
            }
        }
        
        try {
            const user = await userModel.find(query)
            res.send(user)
        }
        catch (err) {
            res.send({ message: err.message })
        }
    }


    async Register(req, res) {
        const { email, password ,nameAccount,phone,role} = req.body

        // Simple validation
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing email and/or password' })
        }

        try {
            // Check for existing user
            const user = await userModel.findOne({ email })

            if (user) {
                return res
                    .status(400)
                    .json({ success: false, message: 'email already taken' })
            }

            // All good
            const hashedPassword = await argon2.hash(password)
            const newUser = new userModel({ email, password: hashedPassword,nameAccount,phone,role })
            await newUser.save()

            console.log( process.env.ACCESS_TOKEN_SECRET);
            // Return token
           /* const accessToken = jwt.sign(
                { userId: newUser._id },
                process.env.ACCESS_TOKEN_SECRET
            )
*/
            res.json({
                success: true,
                message: 'User created successfully',
              //  accessToken
            })
        } catch (error) {
            throw new Error(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }




    async Login(req, res) {
        const { email, password } = req.body

        // Simple validation
        if (!email || !password)
            return res
                .status(400)
                .json({ success: false, message: 'Missing username and/or password' })

        try {
            // Check for existing user
            const user = await userModel.findOne({ email })
            if (!user)
                return res
                    .status(400)
                    .json({ success: false, message: 'Incorrect username or password' })

            // Username found
            const passwordValid = await argon2.verify(user.password, password)
            if (!passwordValid)
                return res
                    .status(400)
                    .json({ success: false, message: 'Incorrect username or password' })

            // All good
            // Return token
           /* const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET
            )*/

            res.json({
                user,
                success: true,
                message: 'User logged in successfully',
               // accessToken
            })
        } catch (error) {
            throw new Error(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async getStaff(req,res){
        let query ={ ...req.query, "role": {$ne: 'CUSTOMER' }}
        if (req.query.role) {
            query.role = req.query.role.toUpperCase()
        }

        if (req.query.textSearch) {
            query.nameAccount = {
                $regex: req.query.textSearch
            }
        }

        try {
            const findRole = await userModel.find(query)
            res.send(findRole)
        } catch (error) {
            throw new Error(error)
        }

    }

    async getUserRole(req,res){
        try {
            const findRole = await userModel.find(req.query)
            res.send(findRole)
        } catch (error) {
            throw new Error(error)
        }
    }




    async changeRoleAdmin(req,res) {
        try{
            const _id = req.params.id;
            const update = await userModel.findByIdAndUpdate(_id,{"role": 'ADMIN'})
            res.send(update)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }



    async changeRoleCustomer(req,res) {
        try{
            const _id = req.params.id;
            const update = await userModel.findByIdAndUpdate(_id,{"role": 'CUSTOMER'})
            res.send(update)
        }
        catch(err)
        {
            res.send('error' + err)
        }
    }

    async deleteUserFromId(req,res){
        const _id = req.params.id
        try{
        const user = await userModel.findByIdAndDelete(_id)
        res.send(user)
        }catch(err)
        {
            throw new Error(err)
        }
    }

    async getAllCustomers(req, res) {
        try {
            const customers = await userModel.find({ role: 'CUSTOMER'})
            res.send(customers)
        }
        catch (error) {
            throw new Error(error)
        }
    }


    async addCart(req,res){
        const product = req.body.productId
        const _id = req.params.id
        try {
            const user = await userModel.findById(_id)
            user.cart.push(product)
            user.save()
            res.send(user)
        } catch (error) {
            throw new Error(error)
            console.log(cart1)
        }
    }

    async deleteCart(req,res){
        try{
        const user = await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {$pull:{cart: req.body.productId}}
        )
        res.send(user)
        }catch(err)
        {
            throw new Error(err)
        }
    }

    async getOneUser(req,res){
        const _id = req.params.id
        try{
        const user = await userModel.findById(_id)
        res.send(user)
        }catch(err)
        {
            throw new Error(err)
        }
    }
  
}

module.exports = new UserController
