import mysql from "mysql2";

import dotenv from 'dotenv'
// import { name } from "tar/lib/types";
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

//  featching All rows of tb table .........

export async function getAllUsers(){
    const [rows] = await pool.query("select * from user_info");
    return rows
} 

//  fetching perticular row of tb table ........

export async function getUser(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM user_info
    WHERE id = ?
    `, [id])
    return rows[0] 
  }
  
// Insert a row at tb table...........

 export async function createUser(name, email, phone, reservation_date, reservation_time, number_of_guests) {
    const [result] = await pool.query(`
    INSERT INTO user_info (name, email, phone, reservation_date, reservation_time, number_of_guests)
    VALUES (?,?,?,?,?,?);
    `, [name, email, phone, reservation_date, reservation_time, number_of_guests])
    const id = result.insertId
    return getUser(id)
 }

// Delete a row from tb table
export async function deleteUser(id) {
  await pool.query(`
  DELETE FROM user_info
  WHERE id = ?;
  `, [id])
}  
// Update a row from tb table
export async function updateUser(id, name, email, phone, reservation_date, reservation_time, number_of_guests) {
  try {
    await pool.query(`
      UPDATE user_info
      SET name=?, email=?, phone=?, reservation_date=?, reservation_time=?, number_of_guests=?
      WHERE id = ?;
    `, [name, email, phone, reservation_date, reservation_time, number_of_guests, id]);

    return true; // Return true to indicate successful update
  } catch (error) {
    console.error(error);
    return false; // Return false to indicate failure
  }
}
