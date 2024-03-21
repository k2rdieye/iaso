import React, { FunctionComponent, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { replace } from 'react-router-redux';
import { Router } from '../../../../../../hat/assets/js/apps/Iaso/types/general';
import { useGetCampaignTypes } from '../Campaigns/hooks/api/useGetCampaignTypes';
import { Calendar } from './Calendar';
import { CalendarParams } from './campaignCalendar/types';

import { genUrl } from '../../../../../../hat/assets/js/apps/Iaso/routing/routing';
import { DropdownOptions } from '../../../../../../hat/assets/js/apps/Iaso/types/utils';

type Props = {
    params: CalendarParams;
    router: Router;
};

const getPolioType = (campaignTypes: DropdownOptions<number>[]) => {
    return campaignTypes.find(type => type.label.toLowerCase() === 'polio');
};

/*
 * This Component is used to prefetch the polio campaign type
 * and redirect to the correct url using polio as default on the first load
 */
export const CalendarContainer: FunctionComponent<Props> = ({
    params,
    router,
}) => {
    const dispatch = useDispatch();
    const { data: campaignTypes } = useGetCampaignTypes();
    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    useEffect(() => {
        if (firstLoad && campaignTypes) {
            const polioType = getPolioType(campaignTypes);
            if (params.accountId) {
                if (
                    polioType &&
                    !params.campaignType &&
                    !params.filterLaunched
                ) {
                    const urlParams = {
                        ...params,
                        campaignType: `${polioType.value}`,
                    };
                    const url = genUrl(router, urlParams);
                    dispatch(replace(url));
                }
                setFirstLoad(false);
            }
        }
    }, [firstLoad, campaignTypes, params, router, dispatch]);

    if (firstLoad || !campaignTypes) return null;

    return (
        <Calendar
            params={params}
            router={router}
            campaignTypes={campaignTypes}
        />
    );
};
