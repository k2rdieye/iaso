import React, { FunctionComponent, useState } from 'react';
// @ts-ignore
import { useSafeIntl, useSkipEffectOnMount } from 'bluesquare-components';
// @ts-ignore
import TopBar from 'Iaso/components/nav/TopBarComponent';
import { Box } from '@material-ui/core';
import { TableWithDeepLink } from '../../../../../../hat/assets/js/apps/Iaso/components/tables/TableWithDeepLink';
import {
    useCampaignParams,
    useGetCampaigns,
} from '../../hooks/useGetCampaigns';
import { useStyles } from '../../styles/theme';
import { BUDGET } from '../../constants/routes';
import { useBudgetColumns } from './config';
import { convertObjectToString } from '../../utils';
import MESSAGES from '../../constants/messages';
import { BudgetFilters } from './BudgetFilters';

type Props = {
    router: any;
};

export const Budget: FunctionComponent<Props> = ({ router }) => {
    const { params } = router;
    const { formatMessage } = useSafeIntl();
    const classes = useStyles();
    const [resetPageToOne, setResetPageToOne] = useState('');

    const apiParams = useCampaignParams({
        ...params,
        show_test: params.show_test ?? false,
        pageSize: params.pageSize ?? 20,
    });

    const { data: campaigns, isFetching } = useGetCampaigns(apiParams).query;
    const columns = useBudgetColumns();
    useSkipEffectOnMount(() => {
        const newParams = {
            ...apiParams,
        };
        delete newParams.page;
        delete newParams.order;
        setResetPageToOne(convertObjectToString(newParams));
    }, [apiParams.pageSize, apiParams.countries, apiParams.search]);

    return (
        <>
            <TopBar
                title={formatMessage(MESSAGES.budget)}
                displayBackButton={false}
            />
            {/* @ts-ignore */}
            <Box className={classes.containerFullHeightNoTabPadded}>
                <BudgetFilters params={params} />
                <TableWithDeepLink
                    data={campaigns?.campaigns ?? []}
                    count={campaigns?.count}
                    pages={campaigns?.pages}
                    params={apiParams}
                    columns={columns}
                    baseUrl={BUDGET}
                    marginTop={false}
                    extraProps={{
                        loading: isFetching,
                    }}
                    resetPageToOne={resetPageToOne}
                />
            </Box>
        </>
    );
};
