import { PartialType } from "@nestjs/swagger";
import { CreateFavoriteDto } from "./create-favorite.dto";

 
 export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {
    // Aquí puedes agregar propiedades adicionales si es necesario
    
 }