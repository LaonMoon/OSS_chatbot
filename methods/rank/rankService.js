import { insertreview,selectReview,selectmenurank,selectmenurankdescription } from "./rankDao";
import pool from "../../config/database";


export const createreview = async(menu,menu_rank,menu_description,)=>{
try{
    const connection = await pool.getConnection(async conn=>conn);
    
    const insertreviewParams = [menu,menu_rank,menu_description];

    //await connection.beginTransaction() 트랜잭션 오류나서 일단 pass 근데 하긴 해야할 듯
    const createreviewResult = await insertreview(connection,insertreviewParams);
    
    //await connection.commit()
    connection.release();

    return createreviewResult;

}catch(err){
    console.log("createreview error");
    //await connection.rollback();
}

}

export const showReview= async(menu)=>{
    const conn = await pool.getConnection(async(conn)=>conn);

    const selectRankResult = await selectmenurankdescription(conn,menu);
    conn.release;
    return selectRankResult;
}

export const showMenuRank= async(menu)=>{
    const conn = await pool.getConnection(async(conn)=>conn);

    const selectRankResult = await selectmenurank(conn,menu);
    conn.release;
    return selectRankResult;
}