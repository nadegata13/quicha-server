

exports.getNowDate = function() {
        let now = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();
        let hours = now.getHours().toString();
        let minutes = now.getMinutes().toString();
        let seconds = now.getSeconds().toString();

        return year + "/" + month + "/" + date + "-" + hours
            + ":" + minutes + ":" + seconds;
    }

    exports.getCustomDate = function(_date) {
        let time = new Date(_date.getTime() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

        let year = time.getFullYear().toString();
        let month = (time.getMonth() + 1).toString();
        let date = time.getDate().toString();
        let hours = time.getHours().toString();
        let minutes = time.getMinutes().toString();
        let seconds = time.getSeconds().toString();

        return year + "/" + month + "/" + date + "-" + hours
            + ":" + minutes + ":" + seconds;
    }