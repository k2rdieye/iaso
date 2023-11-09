import {
    displayDateFromTimestamp,
    textPlaceholder,
} from 'bluesquare-components';
import moment from 'moment';

/* DateTimeCell
   For use in Table's columns to display DateTime
 */
export const DateTimeCell = cellInfo =>
    cellInfo.value ? displayDateFromTimestamp(cellInfo.value) : textPlaceholder;

export const DateTimeCellRfc = cellInfo =>
    cellInfo.value ? moment(cellInfo.value).format('LTS') : textPlaceholder;

export const DateCell = cellInfo =>
    cellInfo.value ? moment(cellInfo.value).format('L') : textPlaceholder;

export const convertValueIfDate = value => {
    const asMoment = moment(value);
    if (moment(value, 'L', true).isValid()) {
        return asMoment.format('L');
    }
    if (moment(value, 'LTS', true).isValid()) {
        return asMoment.format('L');
    }
    return value;
};
