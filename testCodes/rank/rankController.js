import {createreview,showReview} from "./rankService"

/**
 * API No. 1
 * API Name : 리뷰 생성 api
 * [POST] /reviews/
 */

export const postReviews = async(req,res)=>{

    const {menu,menu_rank,menu_description,userID}=req.body;

    if(!(menu=="중식1"||menu=="중식2"||menu=="석식"))
        return res.send("다시 입력하시오");

    if(!menu)
        return res.send("menu의 종류를 입력하세요");
    if(!menu_rank)
        return res.send("menu의 rank를 입력하세요");
    if(!userID)
        return res.send("userid입력오류");
    
    const postReviewResponse = await createreview(menu,menu_rank,menu_description,userID);

    if(postReviewResponse){
        const selectReviewResponse = await showReview();
        res.send(JSON.stringify(selectReviewResponse));

    }


    

}



/*
export const getRank=async(req,res)=>{



}
*/

/*
export const postRank=async(req,res)=>{



}
*/