import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {

    // Dependency Injection
    constructor(
        private userService: UserService,
        private JwtService: JwtService
        ) {
    }

    @UseInterceptors(ClassSerializerInterceptor)

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if(body.password !== body.password_confirm) {
            throw new BadRequestException('Password do not match!');
        }

        const hashed = await bcrypt.hash(body.password, 12);

        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,
            role: {id: 1}
        });
    }

    @Post('login')
    async login(
        // passing properties ( email dan passwordnya )
        @Body('email') email:string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response // passthrough => buat dapetin token dari front-end, passing ke backend
    ) {
        // karena nested jadi pakai await
        const user = await this.userService.findOne({email: email});

        if(!user) {
            throw new NotFoundException('Email is not registered!');
        }

        // compare password yang ada dan password yang diinput
        if(!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Wrong Password!');
        }

        // signAsync(payloadnya id)
        const jwt = await this.JwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt'];

        const data = await this.JwtService.verifyAsync(cookie);

        return this.userService.findOne({id: data['id']});
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: "Success Logout!"
        }
    }
}
