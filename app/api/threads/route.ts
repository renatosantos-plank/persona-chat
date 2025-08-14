import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	const supabase = await createClient();

	const { data: { user }, error: userError } = await supabase.auth.getUser();
	
	if (userError || !user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = user.id;
	
	const { data: threads, error } = await supabase
		.from('threads')
		.select('thread_id, title, updated_at')
		.eq('user_id', userId)
		.order('updated_at', { ascending: false })
		.limit(200);

	if (error) {
		console.error('Error fetching threads:', error);
		return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
	}

	return NextResponse.json({ threads: threads || [] }, { status: 200 });
}