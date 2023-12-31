export class HttpError {
    constructor(public status: number, public message: string) {  // behtare parameter type ezafe shavad
    }
}


type Fields = 'User' | 'Post' | 'Email' | 'Request' | "Comment"
const translate = (field: Fields) => {
    switch (field) {
        case 'Post':
            return 'پست'
        case 'User':
            return 'کاربر'
        case 'Email':
            return 'ایمیل'
        case 'Request':
            return 'درخواست'
        case 'Comment':
            return 'نظر'
    }
}

export class NotFoundError extends HttpError {
    constructor(field: Fields) {
        super(404, `${translate(field)} یافت نشد.`);
    }
}

export class ForbiddenError extends HttpError {
    constructor() {
        super(403, "شما از سیستم خارج شده اید. لطفا دوباره وارد شوید.");
    }
}

export class UnauthorizedError extends HttpError {
    constructor() {
        super(401, "شما اجازه دسترسی به این صفحه را ندارید.");
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(400, message);
    }
}

export class serviceUnavailableError extends HttpError {
    constructor() {
        super(503, "سرور در دسترس نیست.");
    }

}

export class ConflictError extends HttpError {
    constructor(message: string) {
        super(409, message)
    }
}

export class jwtError extends HttpError {
    constructor() {
        super(482, "توکن نامعتبر می‌باشد.");
    }
}
