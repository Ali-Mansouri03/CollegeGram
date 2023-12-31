import { HexadecimalColor } from "../../../../data/hexadecimal-color";
import { TagTitle } from "./tag-title";

export interface SplittedTag {
  title: string;
  color: string;
}

export interface TagInterface {
  title: TagTitle;
  color: HexadecimalColor;
}

export interface CreateTagInterface {
  title: TagTitle;
  color: HexadecimalColor;
}
