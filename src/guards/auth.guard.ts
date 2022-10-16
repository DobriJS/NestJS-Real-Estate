import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        if (roles.length) {
            const request = context.switchToHttp().getRequest();
            const token = request.headers?.authorization?.split('Bearer ')[1];
            try {
                const user = jwt.verify(token, process.env.JWT_KEY);
                console.log({ user });
                return true;

            } catch (error) {
                return false;
            }
        }

        return true;
    }
}