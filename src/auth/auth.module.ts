import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local.strategy";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStratey } from "./jwt.strategy";
import { UserController } from "./users.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.AUTH_SECRET,
                signOptions: {
                    expiresIn: '60m'
                }
            })
        })
    ],
    providers: [
        LocalStrategy,
        AuthService,
        JwtStratey
    ],
    controllers: [
        AuthController,
        UserController
    ]
})
export class AuthModule {}