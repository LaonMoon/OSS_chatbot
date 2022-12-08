import {createreview,showReview,showMenuRank} from "./rankService"

export const postReviews=async(menu,menu_rank,menu_description)=>{

    await createreview(menu,menu_rank,menu_description);


    if(createreview){
        console.log("입력완료")
    }

}


export const getReviewsRanks=async(menu)=>{


    
    const getReviewsRanksResult = await (showMenuRank(menu));
    return (getReviewsRanksResult);

}

export const getReviewsRanksDescription=async(menu2)=>{
    const menu = menu2;

    const getReviewsRanksResult = await (showReview(menu));
    return (getReviewsRanksResult);

}
