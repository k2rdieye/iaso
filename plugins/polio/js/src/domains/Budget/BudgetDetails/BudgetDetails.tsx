/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, {
    FunctionComponent,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { Paginated } from 'bluesquare-components';
import TopBar from '../../../../../../../hat/assets/js/apps/Iaso/components/nav/TopBarComponent';
import { useStyles } from '../../../styles/theme';
import { BUDGET, BUDGET_DETAILS } from '../../../constants/routes';
import { useTableState } from '../hooks/config';
import { redirectToReplace } from '../../../../../../../hat/assets/js/apps/Iaso/routing/actions';
import { useBoundState } from '../../../../../../../hat/assets/js/apps/Iaso/hooks/useBoundState';
import { Optional } from '../../../../../../../hat/assets/js/apps/Iaso/types/utils';
import { handleTableDeepLink } from '../../../../../../../hat/assets/js/apps/Iaso/utils/table';
import { useGetBudgetForCampaign } from '../hooks/api/useGetBudget';
import { useGetBudgetDetails } from '../hooks/api/useGetBudgetDetails';
import { BudgetStep } from '../types';

import { BudgetDetailsCardsLayout } from './mobile/BudgetDetailsCardsLayout';
import { BudgetDetailsTableLayout } from './BudgetDetailsTableLayout';
import { BudgetDetailsFiltersMobile } from './mobile/BudgetDetailsFiltersMobile';
import { BudgetDetailsInfos } from './BudgetDetailsInfos';

type Props = {
    router: any;
};

export const BudgetProcessDetails: FunctionComponent<Props> = ({ router }) => {
    const { params } = router;
    const { campaignName, budgetProcessId, transition_key, ...rest } = params;
    const classes = useStyles();
    const [showHidden, setShowHidden] = useState<boolean>(
        rest.show_hidden ?? false,
    );

    const apiParams = useMemo(() => {
        return {
            ...rest,
            deletion_status: showHidden ? 'all' : undefined,
            budget_process_id: budgetProcessId,
            transition_key__in: transition_key,
        };
    }, [budgetProcessId, rest, showHidden, transition_key]);

    // @ts-ignore
    const prevPathname = useSelector(state => state.routerCustom.prevPathname);
    const dispatch = useDispatch();

    const theme = useTheme();
    const isMobileLayout = useMediaQuery(theme.breakpoints.down('md'));
    const {
        data: budgetDetails,
        isFetching,
    }: { data: Paginated<BudgetStep> | undefined; isFetching: boolean } =
        useGetBudgetDetails(apiParams);

    const { data: budgetProcess } = useGetBudgetForCampaign(
        params?.budgetProcessId,
    );

    const nextSteps = useMemo(() => {
        const regular = budgetProcess?.next_transitions?.filter(
            transition =>
                transition.key !== 'override' &&
                !transition.key.includes('repeat'),
        );
        const repeat = budgetProcess?.next_transitions?.filter(
            step => step.key.includes('repeat') && step.allowed,
        );
        const toDisplay = new Set(
            regular
                ?.filter(transition => !transition.key.includes('repeat'))
                .map(transition => transition.label),
        );
        return { regular, toDisplay, repeat };
    }, [budgetProcess?.next_transitions]);

    const { resetPageToOne, columns } = useTableState({
        events: budgetDetails?.results,
        params,
        budgetDetails,
        repeatTransitions: nextSteps.repeat || [],
    });
    const [page, setPage] = useBoundState<Optional<number | string>>(
        1,
        apiParams?.page ?? 1,
    );
    const onCardPaginationChange = useCallback(
        (_value, newPage) => {
            setPage(newPage);
            handleTableDeepLink(BUDGET_DETAILS)({ ...params, page: newPage });
        },
        [params, setPage],
    );
    const stepsList = Object.entries(
        groupBy(budgetProcess?.possible_transitions, 'label'),
    ).map(([label, items]) => {
        return { label, value: items.map(i => i.key).join(',') };
    });
    return (
        <>
            <TopBar
                title={campaignName}
                displayBackButton
                goBack={() => {
                    if (prevPathname) {
                        router.goBack();
                    } else {
                        dispatch(redirectToReplace(BUDGET, {}));
                    }
                }}
            />
            {/* @ts-ignore */}
            <Box className={classes.containerFullHeightNoTabPadded}>
                <Box mb={2}>
                    <BudgetDetailsInfos
                        budgetProcess={budgetProcess ?? {}}
                        nextSteps={nextSteps}
                        params={params}
                        budgetDetails={budgetDetails}
                    />
                </Box>
                <Grid container spacing={isMobileLayout ? 0 : 2}>
                    {isMobileLayout && (
                        <>
                            <BudgetDetailsFiltersMobile
                                params={params}
                                showHidden={showHidden}
                                setShowHidden={setShowHidden}
                                stepsList={stepsList}
                            />
                            {budgetDetails && (
                                <BudgetDetailsCardsLayout
                                    onCardPaginationChange={
                                        onCardPaginationChange
                                    }
                                    page={page}
                                    budgetDetails={budgetDetails}
                                />
                            )}
                        </>
                    )}
                    {!isMobileLayout && (
                        <Grid item xs={12}>
                            <BudgetDetailsTableLayout
                                budgetDetails={budgetDetails}
                                params={params}
                                columns={columns}
                                isFetching={isFetching}
                                resetPageToOne={resetPageToOne}
                                showHidden={showHidden}
                                setShowHidden={setShowHidden}
                                stepsList={stepsList}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </>
    );
};
