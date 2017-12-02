export const id = (x) => x

export const Success = x => ({
    map: f => Success(f(x)),
    fold: (f, g) => g(x),
    bind: (f) => f(x),
    iter: (f) => f(x),
})

export const Failure = x => ({
    map: f => Failure(x),
    fold: (f, g) => f(x),
    bind: (f) => Failure(x),
    iter: (f) => Failure(x),
})

export const Some = x => ({
    map: f => Some(f(x)),
    fold: (f) => f(x),
    bind: (f) => f(x),
    iter: (f) => f(x),
})

export const None = () => ({
    map: f => None(),
    fold: (f) => None(),
    bind: (f) => None(),
    iter: (f) => None(),
})