import { NextResponse } from "next/server";
import references from "@/data/asl-alphabet-references.json";

export function GET() {
  return NextResponse.json(references);
}
