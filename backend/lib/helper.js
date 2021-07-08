const mv = require('mv');
const fs = require("fs")
class helper {
    convertDate() {
        let current_datetime = new Date()
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        return formatted_date;
    }
    getImageUploadFolder() {
        let current_datetime = new Date()
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let formatted_date = monthNames[current_datetime.getMonth()] + current_datetime.getFullYear();
        return formatted_date;
    }
    getTimestamp() {
        return new Date().getTime();
    }

    uploadFile(filepath, file) {
        const tempPath = file.image.path;
        const folderPath = this.getImageUploadFolder();
        const timestamp = this.getTimestamp();
        fs.mkdir(filepath + folderPath, { recursive: true }, function (err) {
            if (err) {
                //console.log(err)
            } else {
                // console.log("New directory successfully created.")
            }
        });
        const filename = folderPath + '/' + timestamp + "_" + file.image.name
        const targetPath = filepath + filename;
        mv(tempPath, targetPath, function (err) {
            if (err) throw err;
        });
        return filename;
    }

    unlinkFile(filepath, file) {
        fs.unlink(filepath + file, (err) => {
            if (err) {
                //console.error(err)
                return
            }
        })
    }
}
module.exports = helper;