//create_time이 오늘 날자인 거 안에서 해당 menu의 rank를 평균으로 제공
export const selectmenurank = async(connection,menu)=>{

    const selectmenurankQuery = `select sum(menu_rank)/count(ID) from menu_review where DATE(created_time)=DATE(NOW())AND menu=?`;
    const [menurankRows] = await connection.query(selectmenurankQuery,menu);
    return menurankRows;
}

export const selectmenurankdescription = async(connection,menu)=>{

    const selectmenurankQuery = `select menu_rank, menu_description from menu_review where DATE(created_time)=DATE(NOW())AND menu=?`;
    const [menurankRows] = await connection.query(selectmenurankQuery,menu);
    return menurankRows;
}

export const selectmenudescription = async(connection,menu)=>{

    const selectmenurankQuery = `select menu_description from menu_review where DATE(created_time)=DATE(NOW())AND menu=?`;
    const menurankRows = await connection.query(selectmenurankQuery,menu);
    return menurankRows;
}

export const selectUser = async (connection) =>{
    const selectUserListQuery = `SELECT email, nickname FROM UserInfo;`
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}

/*export const insertUser = async (connection) =>{
    const selectUserListQuery = `INSERT ;`
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}*/

//review insert 
export const insertreview = async(connection, insertreviewParams)=>{
    try{
    
    const insertreviewQuery = `INSERT menu_review(menu,menu_rank,menu_description) values(?,?,?);`;
    const insertreviewRow = await connection.query(insertreviewQuery,insertreviewParams)
    
    return insertreviewRow;
    }catch(err){
        console.log("db insert error");
        }

}

export const selectReview = async(connection) => {
    const selectReviewQuery = 'select * from menu_review WHERE DATE(created_time)=DATE(NOW());';
    const selectReviewRow = await connection.query(selectReviewQuery);
    return selectReviewRow;

}

