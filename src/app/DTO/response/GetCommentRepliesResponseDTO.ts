export class GetCommentRepliesResponseDTO{

  idInteraction: number;
  idCommentParent: number;
  image: string;
  nickname: string;
  description: string;
  date: Date;
  getCommentRepliesResponseDTOList : GetCommentRepliesResponseDTO[]
  idAuthorReply: number

}
