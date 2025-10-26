import { NextResponse } from "next/server";

const returnErrorResponse = (error: any) => {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export default returnErrorResponse;