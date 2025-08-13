import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.SUPABASE_CONNECTION_STRING,
});

export async function GET() {
	const { rows } = await pool.query(
		`select thread_id, title, updated_at
    from public.threads
    order by updated_at desc
    limit 200`,
	);
	return NextResponse.json({ threads: rows }, { status: 200 });
}
