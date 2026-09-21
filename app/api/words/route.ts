import { NextResponse } from "next/server";
import wordList from "@/data/word-list.json";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty") as keyof typeof wordList | null;

  if (difficulty && wordList[difficulty]) {
    return NextResponse.json(wordList[difficulty]);
  }

  // Return flat array of all words
  const all = [...wordList.easy, ...wordList.medium, ...wordList.hard];
  return NextResponse.json(all);
}
