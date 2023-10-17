import React, { FunctionComponent } from 'react';
import { Box, makeStyles, Divider, Grid } from '@material-ui/core';
import { useSafeIntl } from 'bluesquare-components';
import MESSAGES from '../../../constants/messages';
import { LqasImDates } from './LqasImDates';
import { DropdownOptions } from '../../../../../../../hat/assets/js/apps/Iaso/types/utils';
import InputComponent from '../../../../../../../hat/assets/js/apps/Iaso/components/forms/InputComponent';

export type LqasImRefDate = {
    date: string;
    isDefault: boolean;
};

type Props = {
    round: number;
    startDate: LqasImRefDate;
    endDate: LqasImRefDate;
    options: DropdownOptions<number>[];
    // eslint-disable-next-line no-unused-vars
    onRoundSelect: (round: number) => void;
};

const styles = () => ({
    // setting marginRight to prevent Divider from breaking the grid, marginLeft to prevent misalignment
    verticalDivider: { marginRight: -1, marginLeft: -1 },
});
// @ts-ignore
const useStyles = makeStyles(styles);
export const LqasImMapHeader: FunctionComponent<Props> = ({
    round,
    startDate,
    endDate,
    options,
    onRoundSelect,
}) => {
    const classes = useStyles();
    const { formatMessage } = useSafeIntl();
    return (
        <Box>
            {options.length > 0 && (
                <Grid container direction="row">
                    <Grid container item xs={6} direction="row">
                        <Grid item xs={12}>
                            <Box ml={2} mr={2}>
                                <InputComponent
                                    type="select"
                                    keyValue="lqasImHeader"
                                    options={options.map(o => ({
                                        ...o,
                                        value: `${o.value}`,
                                    }))}
                                    value={round ? `${round}` : ''}
                                    onChange={(_keyValue, value) =>
                                        onRoundSelect(parseInt(value, 10))
                                    }
                                    labelString={formatMessage(MESSAGES.round)}
                                    clearable={false}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {startDate && endDate && (
                        <>
                            <Divider
                                orientation="vertical"
                                className={classes.verticalDivider}
                                flexItem
                            />
                            <Grid container item xs={6}>
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    xs={6}
                                    alignItems="center"
                                >
                                    <LqasImDates
                                        type="start"
                                        date={startDate}
                                    />
                                </Grid>
                                <Divider
                                    orientation="vertical"
                                    className={classes.verticalDivider}
                                    flexItem
                                />
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    xs={6}
                                    alignItems="center"
                                >
                                    <LqasImDates type="end" date={endDate} />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
            )}
        </Box>
    );
};
