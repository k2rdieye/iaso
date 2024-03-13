/* eslint-disable camelcase */
import { UseMutationResult } from 'react-query';
import { patchRequest, postRequest } from '../../../../libs/Api';
import { useSnackMutation } from '../../../../libs/apiHooks';

export type SavePaymentLotQuery = {
    id?: number;
    name: string;
    comment?: string;
    potential_payments?: number[];
    mark_payments_as_sent?: boolean;
};

const endpoint = '/api/payments/lots/';

type CreateEditPaymentLotFunction<T extends 'create' | 'edit'> = (
    // eslint-disable-next-line no-unused-vars
    body: T extends 'create'
        ? SavePaymentLotQuery
        : Partial<SavePaymentLotQuery>,
    // eslint-disable-next-line no-unused-vars
    type: T,
) => Promise<any>;

const patchPaymentLot = async (body: Partial<SavePaymentLotQuery>) => {
    const url = `${endpoint}${body.id}/`;
    const queryParams = body.mark_payments_as_sent
        ? `?mark_payments_as_sent=${body.mark_payments_as_sent}`
        : '';
    return patchRequest(`${url}${queryParams}`, body);
};

const postPaymentLot = async (body: Partial<SavePaymentLotQuery>) => {
    return postRequest(endpoint, body);
};

const createEditPaymentLot: CreateEditPaymentLotFunction<'create' | 'edit'> = (
    body,
    type,
) => {
    if (type === 'edit') {
        return patchPaymentLot(body as Partial<SavePaymentLotQuery>);
    }
    if (type === 'create') {
        return postPaymentLot(body as SavePaymentLotQuery);
    }
    throw new Error(`wrong type expected: create or edit, got: ${type}`);
};

export const useSavePaymentLot = (
    type: 'create' | 'edit',
    onSuccess?: () => void,
): UseMutationResult => {
    return useSnackMutation({
        mutationFn: (data: Partial<SavePaymentLotQuery>) =>
            createEditPaymentLot(data, type),
        invalidateQueryKey: ['paymentLots', 'potentialPayments'],
        options: { onSuccess },
    });
};