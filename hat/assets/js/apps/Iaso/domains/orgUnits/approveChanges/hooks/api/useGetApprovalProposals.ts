import { makeUrlWithParams } from '../../../../../libs/utils';
import { getRequest } from '../../../../../libs/Api';
import { useSnackQuery } from '../../../../../libs/apiHooks';
import { ApproveChangesPaginated, ApproveOrgUnitParams } from '../../types';

const apiUrl = '/api/orgunits/changes';

const getOrgUnitChangeProposals = (options: ApproveOrgUnitParams) => {
    const apiParams = {
        parent_id: options.parent_id,
        groups: options.groups,
        org_unit_type_id: options.org_unit_type_id,
        status: options.status,
    };

    const url = makeUrlWithParams(apiUrl, apiParams);

    return getRequest(url) as Promise<ApproveChangesPaginated>;
};

export const useGetApprovalProposals = (params: ApproveOrgUnitParams) => {
    return useSnackQuery({
        queryKey: ['getApprovalProposals', params],
        queryFn: () => getOrgUnitChangeProposals(params),
    });
};
