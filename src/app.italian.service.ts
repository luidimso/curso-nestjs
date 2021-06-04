import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AppItalianService {
    constructor(
        @Inject('APP_NAME') private readonly name: string,
        @Inject('MESSAGE') private readonly message: string
    ) {}

    getHello(): string {
        return 'Ciao mondo! from '+this.name+", "+this.message;
    }
}