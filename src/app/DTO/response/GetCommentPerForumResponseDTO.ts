import {GetCommentRepliesResponseDTO} from "./GetCommentRepliesResponseDTO";

export class GetCommentPerForumResponseDTO {
  idInteraction: number;
  idForum: number;
  image: string;
  nickname: string;
  description: string;
  date: Date;
  getCommentRepliesResponseDTOList : GetCommentRepliesResponseDTO[];
  idAuthorComment: number

}
