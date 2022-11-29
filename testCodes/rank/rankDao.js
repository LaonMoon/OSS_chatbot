//create_time이 오늘 날자인 거 안에서 해당 menu의 rank를 평균으로 제공
export const selectmenurank = async(connection)=>{

    const selectmenurankQuery = `select sum(menu_rank)/count(ID)
    FROM menu_review`;
    const menurankRows = await connection.query(selectmenurankQuery);
    return menurankRows;
}


export const selectUser = async (connection) =>{
    const selectUserListQuery = `SELECT email, nickname FROM UserInfo;`
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}


//review insert 
export const insertreview = async(connection, insertreviewParams)=>{
    try{
    
    const insertreviewQuery = `INSERT menu_review(menu,menu_rank,menu_description,userID) values(?,?,?,?);`;
    const insertreviewRow = await connection.query(insertreviewQuery,insertreviewParams)
    
    return insertreviewRow;
    }catch(err){
        console.log("db insert error");
        }

}

export const selectReview = async(connection) => {
    const selectReviewQuery = 'SELECT * FROM menu_review';
    const selectReviewRow = await connection.query(selectReviewQuery);
    return selectReviewRow;

}