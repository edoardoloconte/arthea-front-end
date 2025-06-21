import {GetCommentPerPostResponseDTO} from "./GetCommentPerPostResponseDTO";
import {GetCommentPerForumResponseDTO} from "./GetCommentPerForumResponseDTO";

export class GetAllForumResponseDTO{

  idForum : number
  title : string
  description : string
  image : string
  nameArtist : string
  profilePicArtist : string
  date : Date
  comments : GetCommentPerForumResponseDTO[]
}
