import express from "express"
import {postReviews} from "./rankController"


const rankRouter = express.Router();

rankRouter.post('/',postReviews);

export default rankRouter;