const { User, validate } = require(`../models/User`);
const libHelper = require('../lib/helper');
const helper = new libHelper();
const formidable = require('formidable');
const config = require('../config')()

/**
* Class User Controller
*/

class UserController {
    // TODO: get user list
    async list(req, res) {
        try {
            let limit = 10;
            let page = (Math.abs(req.query.page) || 1) - 1;
            const results = await User.find({ is_deleted: 0 }).limit(limit).skip(limit * page);
            const count = await User.find({ is_deleted: 0 }).countDocuments();
            res.send({
                status: 'success', message: 'Users List', data: results, page: page + 1,
                pages: Math.ceil(count / limit)
            })
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message })
        }
    }
    // TODO: get user info
    async getUser(req, res) {
        try {
            const results = await User.findById(req.params.id);
            res.send({
                status: 'success', message: 'Users Info', data: results
            })
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message })
        }
    }

    // TODO: To add user
    async add(req, res) {
        try {
            new formidable.IncomingForm().parse(req, async (err, fields, files) => {
                if (err) {
                    res.status(400).send({ status: 'error', message: err.message })
                }
                const { error } = validate(fields);
                console.log(error)
                if (error) {
                    var message = [];
                    error.details.forEach(function (value, key) {
                        message.push({ 'key': value['path'][0], 'message': value['message'] })
                    })
                    return res.status(400).send({ status: 'error', message: message });
                }
                const uniqueEmail = await User.find({ email: fields.email }).countDocuments()
                if (uniqueEmail >= 1) {
                    res.status(400).send({ status: 'error', message: 'Email is already exist' })
                }
                let filename = '';
                if (files.image && files.image.name) {
                    filename = helper.uploadFile(config.userspath, files);
                }
                let dob = ''
                if (fields.dob) {
                    dob = new Date(fields.dob)
                    dob = dob.getTime()
                }

                const user = new User({
                    username: fields.username,
                    email: fields.email,
                    dob: dob,
                    mobile_number: fields.mobile_number,
                    country_code: fields.country_code,
                    avatar: filename
                })
                await user.save();
                res.send({ status: 'success', message: 'User has been added successfully', data: user })
            })
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message })
        }
    }

    // TODO: To update user
    async edit(req, res) {
        try {
            const userDetail = await User.findOne({ _id: req.params.id });
            if (userDetail) {
                new formidable.IncomingForm().parse(req, async (err, fields, files) => {
                    if (err) {
                        res.status(400).send({ status: 'error', message: err.message })
                    }
                    const { error } = validate(fields);
                    if (error) {
                        var message = [];
                        error.details.forEach(function (value, key) {
                            message.push({ 'key': value['path'][0], 'message': value['message'] })
                        })
                        return res.status(400).send({ status: 'error', message: message });
                    }

                    const uniqueEmail = await User.find({ email: fields.email, _id: { $ne: userDetail._id } }).countDocuments()
                    if (uniqueEmail >= 1) {
                        res.status(400).send({ status: 'error', message: 'Email is already exist' })
                    }
                    let filename = '';
                    if (typeof files.image != 'undefined' && files.image && files.image.name) {
                        if (userDetail.image) {
                            helper.unlinkFile(config.userspath, userDetail.image)
                        }
                        filename = helper.uploadFile(config.userspath, files);
                    } else {
                        filename = userDetail.avatar
                    }

                    const user = await User.updateOne({ _id: req.params.id }, {
                        username: fields.username,
                        email: fields.email,
                        dob: fields.dob,
                        mobile_number: fields.mobile_number,
                        country_code: fields.country_code,
                        avatar: filename
                    })
                    res.send({ status: 'success', message: 'User has been updated successfully', data: user })
                })
            } else {
                res.status(400).send({ status: 'error', message: 'Invalid id' })
            }
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message })
        }
    }

    // TODO: To delete user
    async delete(req, res) {
        try {
            const userDetail = await User.findOne({ _id: req.params.id });
            if (userDetail) {
                await User.updateOne({ _id: req.params.id }, {
                    is_deleted: 1,
                    email: '_deleted_' + Date.now() + userDetail.email
                })
                res.send({ status: 'success', message: 'User has been deleted successfully' })
            } else {
                res.status(400).send({ status: 'error', message: 'Invalid id' })
            }
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message })
        }
    }
}

module.exports = UserController;