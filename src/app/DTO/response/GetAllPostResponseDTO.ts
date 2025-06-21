import {GetCommentPerPostResponseDTO} from "./GetCommentPerPostResponseDTO";
import {GetLikePerPostResponseDTO} from "./GetLikePerPostResponseDTO";
import {GetReviewsResponseDTO} from "./GetReviewsResponseDTO";

export class GetAllPostResponseDTO{

    idPost : number
    title : string
    description : string
    image : string
    nameUser : string
    descriptionLocation : string
    profilePicUser : string
    numLikes : number
    comments : GetCommentPerPostResponseDTO[]
    likes : GetLikePerPostResponseDTO[]
    reviews : GetReviewsResponseDTO[]
    dateCreation : Date
    idUser : number
}
