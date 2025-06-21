import {GetCommentRepliesResponseDTO} from "./GetCommentRepliesResponseDTO";

export class GetCommentPerPostResponseDTO{
  idInteraction:number
  idPost:number
  image: string;
  nickname: string;
  description: string;
  date : Date
  getCommentRepliesResponseDTOList : GetCommentRepliesResponseDTO[]
}
