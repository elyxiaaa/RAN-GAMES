import { RankingBoard } from "../components/ranking/RankingBoard";
import { RankingHeader } from "../components/ranking/RankingHeader";
import { RankingNotes } from "../components/ranking/RankingNotes";

export function RankingPage() {
  return (
    <>
      <RankingHeader />
      <RankingBoard />
      <RankingNotes />
    </>
  );
}
