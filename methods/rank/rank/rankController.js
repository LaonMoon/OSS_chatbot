import {createreview,showReview,showMenuRank} from "./rankService"

/**
 * API No. 1
 * API Name : 리뷰 생성 api
 * [POST] /reviews/
 */

export const postReviews=async(menu,menu_rank,menu_description)=>{

    await createreview(menu,menu_rank,menu_description);

    /*if(!menu)
        return res.send("menu의 종류를 입력하세요(중식1(소반),중식2(특식),석식)");

    if(!(menu=="소반"||menu=="특식"||menu=="석식"))
        return res.send("중식1,중식2,석식 중에 다시 입력하시오");
    
    if(!menu_rank)
        return res.send("menu의 별점를 0부터5까지 정수형으로 입력하세요");
    
    if(menu_rank<0||menu_rank>5)
        return res.send("menu의 점수는 0이상, 5이하의 정수형태로 입력해주세요");

    if(!Number.isInteger(menu_rank))
        return res.send("menu의 점수는 정수형으로 입력해주세요");

    if(!menu_description)
        return res.send("후기는 어떤가요?");*/

    if(createreview){
        console.log("입력완료")
    }
    /*
    if(!userID)
        return res.send("userid입력오류");
        */
    
}

/**
 * API No. 1
 * API Name : 리뷰 가져오기 api + paging 처리
 * [GET]] /reviews/
 */

export const getReviewsRanks=async(menu)=>{


   // if(!menu)
    // return res.send("조회를 원하는 menu를 입력해주세요");
    
    const getReviewsRanksResult = await (showMenuRank(menu));
    return (getReviewsRanksResult);

}

export const getReviewsRanksDescription=async(menu2)=>{
    const menu = menu2;

    const getReviewsRanksResult = await (showReview(menu));
    return (getReviewsRanksResult);

}
