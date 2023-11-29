/* eslint-disable camelcase */

import { AuthorisationAPIData } from '../VaccineModule/Nopv2Authorisations/types';

export type NotificationsParams = {
    limit: string;
    order: string;
    page: string;
    vdpv_category?: string;
    source?: string;
    country?: string;
    date_of_onset_after?: string; // Date
    date_of_onset_before?: string; // Date
};

export type NotificationsApiData = {
    account: number;
    closest_match_vdpv2?: string;
    country?: string;
    created_at: string; // DateTime
    created_by: number;
    date_of_onset: string; // Date
    date_results_received?: string; // Date
    district?: string;
    epid_number: string;
    lineage?: string;
    org_unit?: number;
    province?: string;
    site_name?: string;
    source?: string;
    updated_at?: string; // DateTime
    updated_by?: number;
    vdpv_category?: string;
    vdpv_nucleotide_diff_sabin2?: string;
};

export type NotificationsApiResponse = {
    results: NotificationsApiData[];
    count: number;
    limit: number;
    page: number;
    pages: number;
};
