import { Slide } from "./presentation";

export interface ITemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  slides?: Slide[];
}
