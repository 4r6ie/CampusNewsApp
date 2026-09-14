import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database';

export async function query<T extends RowDataPacket[] = RowDataPacket[]>(
  sql: string,
  params: any[] = [],
): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export async function execute(
  sql: string,
  params: any[] = [],
): Promise<ResultSetHeader> {
  const [result] = await pool.execute(sql, params);
  return result as ResultSetHeader;
}

export { RowDataPacket, ResultSetHeader };