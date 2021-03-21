//Imports
// const express = require("express")
// mongoose = require("mongoose")
// cors = require("cors")
// module.exports = express 


// do i need this? 
// const passportLocal = require("passport-local").Strategy;
//Imports
import express from 'express'
import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import passportLocal from 'passport-local'
import passportGoogle from 'passport-google-oauth20'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Pusher from 'pusher'

export { express, mongoose, Joi, bcrypt, passport, passportLocal, passportGoogle, session, cors, cookieParser, Pusher}
