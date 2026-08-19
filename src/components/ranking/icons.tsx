import type { ReactNode } from "react";
import {
  Butterfly,
  Crosshair,
  FirstAidKit,
  HandFist,
  MagicWand,
  Sword,
  UsersThree,
} from "@phosphor-icons/react";
import type { ClassFilterId } from "../../data/ranking";

/**
 * The rail keeps line glyphs rather than the class portraits used in rows:
 * these are filters, not characters, and one of them covers every class.
 * Row portraits are ClassIcon in marks.tsx.
 *
 * The rail adds the two shaman builds the game ranks on their own.
 */
export const FILTER_ICON: Record<ClassFilterId, ReactNode> = {
  all: <UsersThree size={15} weight="fill" />,
  resurrection: <Butterfly size={15} weight="fill" />,
  brawler: <HandFist size={15} weight="fill" />,
  swordsman: <Sword size={15} weight="fill" />,
  archer: <Crosshair size={15} weight="bold" />,
  shaman: <MagicWand size={15} weight="fill" />,
  heal: <FirstAidKit size={15} weight="fill" />,
};
