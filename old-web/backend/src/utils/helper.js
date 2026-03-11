const msg = (obj) => {
    return {
        success: true,
        code: obj.code ? obj.code : 200,
        message: obj.message ? obj.message : 'Success',
        error: obj.error ? obj.error : null,
        data: obj.data ? obj.data : null,
    }
}
const errMsg = (obj) => {
    return {
        success: false,
        code: obj.code ? obj.code : 500,
        message: obj.message ? obj.message : 'Error',
        error: obj.error ? obj.error : null,
        data: obj.data ? obj.data : null,
    }
}

const formatDate = (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

    return formattedDate;
};

module.exports = {
    msg,
    errMsg,
    formatDate,
}