import axios from 'axios';
import moment from 'moment-jalaali';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';

var host = window.location.hostname;
// var host = 'account.azzahraa.sharif.ir';
export const BASE_URL = 'http://' + host + '/api/';
// export const BASE_URL = 'http://localhost:8000/';
export const HTTP = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept-Language': 'fa-ir'
    }
});

export function exportExcel(list) {

    /* generate a worksheet */
    var ws = XLSX.utils.json_to_sheet(_.map(list, item => {
        delete item['$$hashKey'];
        return item;
    }));

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "list");

    /* write workbook (use type 'binary') */
    var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

    /* generate a download */
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    FileSaver.saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "export.xlsx");
}


export function persianStringToNumber(string) {
    switch (string) {
        case 'اول':
            return 1;
        case 'دوم':
            return 2;
        case 'سوم':
            return 3;
        case 'چهارم':
            return 4;
        case 'پنجم':
            return 5;
        case 'ششم':
            return 6;
        case 'هفتم':
            return 7;
        case 'هشتم':
            return 8;
        case 'نهم':
            return 9;
        case 'دهم':
            return 10;
        case 'یازدهم':
            return 11;
        case 'دوازدهم':
            return 12;
        case 'سیزدهم':
            return 13;
        case 'چهاردهم':
            return 14;
        case 'پانزدهم':
            return 15;
        case 'شانزدهم':
            return 16;
        case 'هفدهم':
            return 17;
        case 'هجدهم':
            return 18;
        case 'نوزدهم':
            return 19;
        case 'بیستم':
            return 20;
        case 'بیست و یکم':
            return 21;
        case 'بیست و دوم':
            return 22;
        case 'بیست و سوم':
            return 23;
        case 'بیست و چهارم':
            return 24;
        default:
            return 0
    }

}

export function objectToQueryString(obj) {
    let str = [];

    for (var p in obj) {
        if (obj.hasOwnProperty(p) && obj[p] !== undefined && obj[p] !== null && obj[p] !== '') {
            let property = encodeURIComponent(p);
            let value = obj[p];
            if (property.startsWith('list__')) {
                property = property.replace('list__', '');
                value = value.join(',');
            }
            if (property.startsWith('jalali__')) {
                property = property.replace('jalali__', '');
                value = moment(value, 'jYYYY/jM/jD').format('YYYY-MM-DD')
            }
            if (property.endsWith('__ne')) {
                property = property.substring(0, property.length - 4);
                str.push(property + '!=' + encodeURIComponent(value));
            } else {
                str.push(property + '=' + encodeURIComponent(value));
            }
        }
    }
    return str.join('&');
}

export function formToJson(form) {
    let fd = new FormData(form);
    var result = {};
    for (var entry of fd.entries()) {
        result[entry[0]] = entry[1];
    }
    return result;
}
