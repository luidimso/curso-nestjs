import { IsDateString, IsString, Length } from "class-validator";

export class CreateEventDTO {
    @IsString() @Length(6, 255, {
        message: 'The name length is wrong'
    }) name: string;
    @Length(6, 255) description: string;
    @IsDateString() when: string;
    @Length(6, 255) address: string;
}