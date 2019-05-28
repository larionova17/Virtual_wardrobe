class Utils {
    static parseRequestURL() {
        const url = location.hash.slice(1),
            request = {};

        [,request.resource, request.id] = url.split('/');

        return request;
    }
}

export default Utils;