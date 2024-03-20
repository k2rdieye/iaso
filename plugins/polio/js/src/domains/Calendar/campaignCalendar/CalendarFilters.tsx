/* eslint-disable react/jsx-props-no-spreading */
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { replace } from 'react-router-redux';

import FiltersIcon from '@mui/icons-material/FilterList';
import { Box, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { IntlFormatMessage, useSafeIntl } from 'bluesquare-components';
import InputComponent from '../../../../../../../hat/assets/js/apps/Iaso/components/forms/InputComponent';
import { useGetGroupDropdown } from '../../../../../../../hat/assets/js/apps/Iaso/domains/orgUnits/hooks/requests/useGetGroups';
import { Router } from '../../../../../../../hat/assets/js/apps/Iaso/types/general';
import MESSAGES from '../../../constants/messages';
import { useGetCountries } from '../../../hooks/useGetCountries';
import { useGetGroupedCampaigns } from '../../GroupedCampaigns/hooks/useGetGroupedCampaigns';

import { genUrl } from '../../../../../../../hat/assets/js/apps/Iaso/routing/routing';
import { DropdownOptions } from '../../../../../../../hat/assets/js/apps/Iaso/types/utils';
import { appId } from '../../../constants/app';
import { CalendarParams } from './types';

type Props = {
    router: Router & { params: CalendarParams };
    campaignTypes: DropdownOptions<number>[];
};

const campaignCategoryOptions = (
    // eslint-disable-next-line no-unused-vars
    formatMessage: IntlFormatMessage,
) => {
    const options = [
        { label: formatMessage(MESSAGES.all), value: 'all' },
        { label: formatMessage(MESSAGES.preventiveShort), value: 'preventive' },
        { label: formatMessage(MESSAGES.regular), value: 'regular' },
    ];
    return options;
};

const getPolioType = (campaignTypes: DropdownOptions<number>[]) => {
    return campaignTypes.find(type => type.label.toLowerCase() === 'polio');
};

export const CalendarFilters: FunctionComponent<Props> = ({
    router,
    campaignTypes,
}) => {
    const { formatMessage } = useSafeIntl();
    const polioType = getPolioType(campaignTypes);
    const { params } = router;
    const [filtersUpdated, setFiltersUpdated] = useState(false);
    const [countries, setCountries] = useState(params.countries);
    const [orgUnitGroups, setOrgUnitGroups] = useState(params.orgUnitGroups);
    const [campaignType, setCampaignType] = useState(
        params.campaignType || polioType,
    );
    const [campaignCategory, setCampaignCategory] = useState(
        params.campaignCategory,
    );
    const [campaignGroups, setCampaignGroups] = useState(params.campaignGroups);
    const [search, setSearch] = useState(params.search);

    const filtersFilled =
        countries ||
        search ||
        campaignType ||
        campaignCategory ||
        campaignGroups ||
        orgUnitGroups;

    const dispatch = useDispatch();
    const handleSearch = useCallback(() => {
        if (filtersUpdated) {
            setFiltersUpdated(false);
            const urlParams = {
                countries,
                search: search && search !== '' ? search : undefined,
                page: null,
                campaignType,
                campaignCategory,
                campaignGroups,
                orgUnitGroups,
                filterLaunched: filtersFilled ? 'true' : 'false',
            };
            const url = genUrl(router, urlParams);
            dispatch(replace(url));
        }
    }, [
        filtersUpdated,
        countries,
        search,
        campaignType,
        campaignCategory,
        campaignGroups,
        orgUnitGroups,
        filtersFilled,
        router,
        dispatch,
    ]);
    const { data, isFetching: isFetchingCountries } = useGetCountries();
    const { data: groupedCampaigns, isFetching: isFetchingGroupedGroups } =
        useGetGroupedCampaigns();
    // Pass the appId to have it works in the embedded calendar where the user is not connected
    const { data: groupedOrgUnits, isFetching: isFetchingGroupedOrgUnits } =
        useGetGroupDropdown({ blockOfCountries: 'True', appId });
    const groupedCampaignsOptions = useMemo(
        () =>
            groupedCampaigns?.results.map(result => ({
                label: result.name,
                value: result.id,
            })) ?? [],
        [groupedCampaigns],
    );
    const countriesList = (data && data.orgUnits) || [];

    const theme = useTheme();
    const isLargeLayout = useMediaQuery(theme.breakpoints.up('md'));
    const [textSearchError, setTextSearchError] = useState(false);

    useEffect(() => {
        setFiltersUpdated(true);
    }, [
        countries,
        search,
        campaignType,
        campaignCategory,
        campaignGroups,
        orgUnitGroups,
    ]);

    useEffect(() => {
        setFiltersUpdated(false);
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <InputComponent
                        keyValue="search"
                        onChange={(key, value) => {
                            setSearch(value);
                        }}
                        value={search}
                        type="search"
                        label={MESSAGES.search}
                        onEnterPressed={handleSearch}
                        blockForbiddenChars
                        onErrorChange={setTextSearchError}
                    />
                    <InputComponent
                        loading={isFetchingGroupedOrgUnits}
                        keyValue="orgUnitGroups"
                        multi
                        clearable
                        onChange={(key, value) => {
                            setOrgUnitGroups(value);
                        }}
                        value={orgUnitGroups}
                        type="select"
                        options={groupedOrgUnits}
                        label={MESSAGES.countryBlock}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <InputComponent
                        loading={isFetchingCountries}
                        keyValue="campaignCategory"
                        clearable
                        onChange={(_key, value) => {
                            setCampaignCategory(value);
                        }}
                        value={campaignCategory}
                        type="select"
                        options={campaignCategoryOptions(formatMessage)}
                        label={MESSAGES.campaignCategory}
                    />
                    <InputComponent
                        keyValue="campaignType"
                        clearable
                        onChange={(_key, value) => {
                            setCampaignType(value);
                        }}
                        multi
                        value={campaignType}
                        type="select"
                        options={campaignTypes}
                        label={MESSAGES.campaignType}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <InputComponent
                        loading={isFetchingGroupedGroups}
                        keyValue="campaignGroups"
                        clearable
                        multi
                        onChange={(_key, value) => {
                            setCampaignGroups(value);
                        }}
                        value={campaignGroups}
                        type="select"
                        options={groupedCampaignsOptions}
                        label={MESSAGES.groupedCampaigns}
                    />
                    <InputComponent
                        loading={isFetchingCountries}
                        keyValue="countries"
                        multi
                        clearable
                        onChange={(key, value) => {
                            setCountries(value);
                        }}
                        value={countries}
                        type="select"
                        options={countriesList.map(c => ({
                            label: c.name,
                            value: c.id,
                        }))}
                        label={MESSAGES.country}
                    />
                </Grid>
                <Grid container item xs={12} md={3} justifyContent="flex-end">
                    <Box mt={isLargeLayout ? 2 : 0}>
                        <Button
                            disabled={textSearchError || !filtersUpdated}
                            variant="contained"
                            color="primary"
                            onClick={() => handleSearch()}
                        >
                            <Box mr={1} top={3} position="relative">
                                <FiltersIcon />
                            </Box>
                            <FormattedMessage {...MESSAGES.filter} />
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
