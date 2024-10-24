import jwt from 'jsonwebtoken';
import User from '../Models/User.model.js';

const Protection= async(req, res, next) => {
    const token =req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const isValid=await User.findOne({_id:decoded.id});
        if(!isValid){
            return res.status(401).json({msg:'Token is not valid'});
        }
        req.user=decoded;
        next();
    }
    catch(err){
        res.status(401).json({msg:'Token is not valid'});
    }
}

const AdminProtection= (req, res, next) => {
    const token =req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        if(req.user.Role!=='Admin'){
            return res.status(401).json({msg:'Not authorized as an admin'});
        }
        next();
    }
    catch(err){
        res.status(401).json({msg:'Token is not valid'});
    }
}

const SuperAdminProtection= (req, res, next) => {
    const token =req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        if(req.user.Role!=='SuperAdmin'){
            return res.status(401).json({msg:'Not authorized as a super admin'});
        }
        next();
    }
    catch(err){
        res.status(401).json({msg:'Token is not valid'});
    }
}

export {Protection, AdminProtection, SuperAdminProtection};