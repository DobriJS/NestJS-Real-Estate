import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(() => {
    return {
        id: 4,
        name: 'Dobri'
    }
})