export interface JWTPayload {
    name: string;
    id: number;
    iat: number;
    exp: number;
}