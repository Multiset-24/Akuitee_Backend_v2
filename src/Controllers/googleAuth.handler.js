import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendOtpMail from '../Utils/SendOtpMail.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import {AsyncHandler} from '../Utils/AsyncHandler.js';