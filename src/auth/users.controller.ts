import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create-user.dto";
import { User } from "./user.entity";

@Controller('users')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    @Post()
    async create(@Body() newUser: CreateUserDto) {
        const user = new User();

        if(newUser.password !== newUser.retypedPassword) {
            throw new BadRequestException(["Passwords are not identical"]);
        }

        const existingUser = await this.userRepository.findOne({
            where: [{
                username: newUser.username
            }, {
                email: newUser.email
            }]
        });

        if(existingUser) {
            throw new BadRequestException(["username or email is already taken"]);
        }

        user.username = newUser.username;
        user.password = await this.authService.hashPassword(newUser.password);
        user.email = newUser.email;
        user.firstName = newUser.firstName;
        user.lastName = newUser.lastName;

        return {
            ...(await this.userRepository.save(user)),
            token: this.authService.getTokenForUser(user)
        };
    }
}