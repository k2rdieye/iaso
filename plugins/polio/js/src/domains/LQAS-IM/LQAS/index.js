/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
    useSafeIntl,
    commonStyles,
    useSkipEffectOnMount,
} from 'bluesquare-components';
import { Grid, Box, makeStyles, Paper } from '@material-ui/core';
import { DisplayIfUserHasPerm } from 'Iaso/components/DisplayIfUserHasPerm';
import TopBar from 'Iaso/components/nav/TopBarComponent';
import { useDispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { useParams } from 'react-router';
import { Filters } from '../shared/Filters.tsx';
import { CaregiversTable } from '../shared/CaregiversTable.tsx';
import { GraphTitle } from '../shared/GraphTitle.tsx';
import { LqasImHorizontalChart } from '../shared/LqasImHorizontalChart.tsx';
import { DistrictsNotFound } from '../shared/DistrictsNotFound.tsx';
import { DatesIgnored } from '../shared/DatesIgnored.tsx';
import { HorizontalDivider } from '../../../components/HorizontalDivider.tsx';
import { LqasImVerticalChart } from '../shared/LqasImVerticalChart.tsx';
import { useLqasData } from './hooks/useLqasData.ts';
import { LqasOverviewContainer } from './CountryOverview/LqasOverviewContainer.tsx';
import MESSAGES from '../../../constants/messages';
import { BadRoundNumbers } from '../shared/BadRoundNumber.tsx';
import { makeDropdownOptions } from '../shared/LqasIm.tsx';
import { useGenUrl } from '../../../../../../../hat/assets/js/apps/Iaso/routing/routing.ts';
import { commaSeparatedIdsToArray } from '../../../../../../../hat/assets/js/apps/Iaso/utils/forms';
import { defaultRounds, paperElevation } from '../shared/constants.ts';
import { useLqasIm } from '../shared/requests.ts';
import { Sides } from '../../../constants/types.ts';

const styles = theme => ({
    ...commonStyles(theme),
    filter: { paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) },
});

const useStyles = makeStyles(styles);

export const Lqas = () => {
    const { formatMessage } = useSafeIntl();
    const genUrl = useGenUrl();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { campaign, country, rounds } = useParams;
    const [selectedRounds, setSelectedRounds] = useState(
        rounds ? commaSeparatedIdsToArray(rounds) : defaultRounds,
    );
    const { data: LQASData, isFetching } = useLqasIm('lqas', country);

    const {
        convertedData,
        campaigns,
        campaignsFetching,
        debugData,
        hasScope,
        chartData,
    } = useLqasData({ campaign, country, selectedRounds, LQASData });

    const dropDownOptions = useMemo(() => {
        return makeDropdownOptions(LQASData?.stats, campaign);
    }, [LQASData, campaign]);

    const onRoundChange = useCallback(
        index => value => {
            const updatedSelection = [...selectedRounds];
            updatedSelection[index] = value;
            setSelectedRounds(updatedSelection);
            const url = genUrl({
                rounds: updatedSelection,
            });
            dispatch(push(url));
        },
        [dispatch, genUrl, selectedRounds],
    );

    const divider = (
        <HorizontalDivider mt={6} mb={4} ml={-4} mr={-4} displayTrigger />
    );
    useSkipEffectOnMount(() => {
        setSelectedRounds(defaultRounds);
    }, [campaign, country]);

    return (
        <>
            <TopBar
                title={formatMessage(MESSAGES.lqas)}
                displayBackButton={false}
            />
            <Box className={classes.containerFullHeightNoTabPadded}>
                <Filters
                    isFetching={isFetching}
                    campaigns={campaigns}
                    campaignsFetching={campaignsFetching}
                    category="lqas"
                />
                <Grid container spacing={2} direction="row">
                    {selectedRounds.map((rnd, index) => (
                        <Grid item xs={6} key={`round_${rnd}_${index}`}>
                            <LqasOverviewContainer
                                round={parseInt(rnd, 10)} // parsing the rnd because it will be a string when coming from params
                                campaign={campaign}
                                campaigns={campaigns}
                                country={country}
                                data={convertedData}
                                isFetching={isFetching}
                                debugData={debugData}
                                paperElevation={paperElevation}
                                onRoundChange={onRoundChange(index)}
                                options={dropDownOptions}
                                side={index === 0 ? Sides.left : Sides.right}
                            />
                        </Grid>
                    ))}
                </Grid>

                {campaign && !isFetching && (
                    <>
                        {divider}
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12}>
                                <GraphTitle
                                    text={formatMessage(MESSAGES.lqasPerRegion)}
                                    displayTrigger
                                />
                            </Grid>
                            {selectedRounds.map((rnd, index) => (
                                <Grid
                                    item
                                    xs={6}
                                    key={`horiz-chart-${rnd}_${index}`}
                                >
                                    <Paper elevation={paperElevation}>
                                        <LqasImHorizontalChart
                                            type="lqas"
                                            round={parseInt(rnd, 10)}
                                            campaign={campaign}
                                            countryId={parseInt(country, 10)}
                                            data={convertedData}
                                            isLoading={isFetching}
                                        />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {divider}
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12}>
                                <GraphTitle
                                    text={formatMessage(
                                        MESSAGES.reasonsNoFingerMarked,
                                    )}
                                    displayTrigger={hasScope}
                                />
                            </Grid>
                            {chartData.nfm.map(d => (
                                <Grid item xs={6} key={d.chartKey}>
                                    <Paper elevation={paperElevation}>
                                        <Box p={2}>
                                            <LqasImVerticalChart
                                                data={d.data}
                                                chartKey={d.chartKey}
                                                title={d.title}
                                                isLoading={isFetching}
                                                showChart={Boolean(campaign)}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <HorizontalDivider
                            mt={6}
                            mb={4}
                            ml={0}
                            mr={0}
                            displayTrigger
                        />
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12}>
                                <GraphTitle
                                    text={formatMessage(
                                        MESSAGES.reasonsForAbsence,
                                    )}
                                    displayTrigger={hasScope}
                                />
                            </Grid>
                            {chartData.rfa.map(d => (
                                <Grid item xs={6} key={d.chartKey}>
                                    <Paper elevation={paperElevation}>
                                        <Box p={2}>
                                            <LqasImVerticalChart
                                                data={d.data}
                                                chartKey={d.chartKey}
                                                title={d.title}
                                                isLoading={isFetching}
                                                showChart={Boolean(campaign)}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {divider}
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12}>
                                <GraphTitle
                                    text={formatMessage(
                                        MESSAGES.caregivers_informed,
                                    )}
                                    displayTrigger
                                />
                            </Grid>
                            {chartData.cg.map(c => (
                                <Grid item xs={6} key={c.chartKey}>
                                    <CaregiversTable
                                        marginTop={false}
                                        campaign={campaign}
                                        round={c.round}
                                        chartKey={c.chartKey}
                                        data={convertedData}
                                        paperElevation={paperElevation}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        {Object.keys(convertedData).length > 0 && (
                            <DisplayIfUserHasPerm permission="iaso_polio_config">
                                <HorizontalDivider
                                    mt={2}
                                    mb={4}
                                    ml={-4}
                                    mr={-4}
                                    displayTrigger
                                />
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <DistrictsNotFound
                                            data={LQASData.stats}
                                            campaign={campaign}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <DatesIgnored
                                            campaign={campaign}
                                            data={LQASData}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <BadRoundNumbers
                                            formsWithBadRoundNumber={
                                                LQASData?.stats[campaign]
                                                    ?.bad_round_number ?? 0
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </DisplayIfUserHasPerm>
                        )}
                    </>
                )}
            </Box>
        </>
    );
};
