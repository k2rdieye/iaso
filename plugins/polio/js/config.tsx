/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import DataSourceIcon from '@mui/icons-material/ListAltTwoTone';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PublicIcon from '@mui/icons-material/Public';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import GroupWork from '@mui/icons-material/GroupWork';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExtensionIcon from '@mui/icons-material/Extension';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorageIcon from '@mui/icons-material/Storage';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Dashboard } from './src/domains/Campaigns/CampaignsList/Dashboard';
import { Calendar } from './src/domains/Calendar/Calendar';
import { CampaignHistory } from './src/domains/Campaigns/campaignHistory/CampaignHistory';
import { CountryNotificationsConfig } from './src/domains/Config/CountryNotification/CountryNotificationsConfig';
import { ReasonsForDelay } from './src/domains/Config/ReasonsForDelay/ReasonsForDelay';
import MESSAGES from './src/constants/messages';
import {
    DASHBOARD_BASE_URL,
    CAMPAIGN_HISTORY_URL,
    GROUPED_CAMPAIGNS,
    CALENDAR_BASE_URL,
    CONFIG_COUNTRY_URL,
    CONFIG_REASONS_FOR_DELAY_URL,
    LQAS_BASE_URL,
    IM_GLOBAL,
    IM_IHH,
    IM_OHH,
    BUDGET,
    BUDGET_DETAILS,
    LQAS_AFRO_MAP_URL,
    NOPV2_AUTH,
    NOPV2_AUTH_DETAILS,
    VACCINE_SUPPLY_CHAIN,
    VACCINE_SUPPLY_CHAIN_DETAILS,
    STOCK_MANAGEMENT,
    STOCK_MANAGEMENT_DETAILS,
    STOCK_VARIATION,
    NOTIFICATIONS_BASE_URL,
} from './src/constants/routes';
import fr from './src/constants/translations/fr.json';
import en from './src/constants/translations/en.json';
import { Lqas } from './src/domains/LQAS-IM/LQAS';
import { ImStats } from './src/domains/LQAS-IM/IM';
import { paginationPathParams } from '../../../hat/assets/js/apps/Iaso/routing/common';
import { GroupedCampaigns } from './src/domains/GroupedCampaigns/GroupedCampaigns';
import { BudgetDetails } from './src/domains/Budget/BudgetDetails/BudgetDetails';
import { BudgetList } from './src/domains/Budget';
import { LqasAfroOverview } from './src/domains/LQAS-IM/LQAS/LqasAfroOverview/LqasAfroOverview';
import { Nopv2Authorisations } from './src/domains/VaccineModule/Nopv2Authorisations/Nopv2Authorisations';
import { Nopv2AuthorisationsDetails } from './src/domains/VaccineModule/Nopv2Authorisations/Details/Nopv2AuthorisationsDetails';
import { VaccineSupplyChain } from './src/domains/VaccineModule/SupplyChain/VaccineSupplyChain';
import { VaccineStockManagement } from './src/domains/VaccineModule/StockManagement/VaccineStockManagement';
import { VaccineStockManagementDetails } from './src/domains/VaccineModule/StockManagement/Details/VaccineStockManagementDetails';
import { VaccineStockVariation } from './src/domains/VaccineModule/StockManagement/StockVariation/VaccineStockVariation';
import {
    DESTRUCTION,
    FORM_A,
    INCIDENT,
    UNUSABLE_VIALS,
    USABLE_VIALS,
} from './src/domains/VaccineModule/StockManagement/constants';
import { VaccineSupplyChainDetails } from './src/domains/VaccineModule/SupplyChain/Details/VaccineSupplyChainDetails';
import { Notifications } from './src/domains/Notifications/index';

const campaignsFilters = [
    {
        isRequired: false,
        key: 'countries',
    },
    {
        isRequired: false,
        key: 'search',
    },
    {
        isRequired: false,
        key: 'roundStartFrom',
    },
    {
        isRequired: false,
        key: 'roundStartTo',
    },
    {
        isRequired: false,
        key: 'showOnlyDeleted',
    },
    {
        isRequired: false,
        key: 'campaignType',
    },
    {
        isRequired: false,
        key: 'campaignGroups',
    },
    {
        isRequired: false,
        key: 'show_test',
    },
];

const routes = [
    {
        baseUrl: DASHBOARD_BASE_URL,
        component: props => <Dashboard {...props} />,
        permissions: ['iaso_polio'],
        isRootUrl: true,
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'campaignId',
            },
            ...campaignsFilters,
            {
                isRequired: false,
                key: 'fieldset',
            },
            {
                isRequired: false,
                key: 'orgUnitGroups',
            },
        ],
    },

    {
        baseUrl: CAMPAIGN_HISTORY_URL,
        component: props => <CampaignHistory {...props} />,
        permissions: ['iaso_polio'],
        isRootUrl: true,
        params: [
            {
                isRequired: true,
                key: 'campaignId',
            },
            {
                isRequired: false,
                key: 'logId',
            },
        ],
    },
    {
        baseUrl: GROUPED_CAMPAIGNS,
        component: props => <GroupedCampaigns {...props} />,
        permissions: ['iaso_polio'],
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'campaignId',
            },
            ...campaignsFilters,
        ],
    },
    {
        baseUrl: CALENDAR_BASE_URL,
        component: props => <Calendar {...props} />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'currentDate',
            },
            {
                isRequired: false,
                key: 'order',
            },
            ...campaignsFilters,
            {
                isRequired: false,
                key: 'orgUnitGroups',
            },
        ],
    },
    {
        baseUrl: `${LQAS_BASE_URL}/lqas`,
        component: props => <Lqas {...props} />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'campaign',
            },
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'rounds',
            },
            {
                isRequired: false,
                key: 'leftTab',
            },
            {
                isRequired: false,
                key: 'rightTab',
            },
        ],
    },
    {
        baseUrl: `${LQAS_AFRO_MAP_URL}`,
        component: props => <LqasAfroOverview {...props} />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'rounds',
            },
            {
                isRequired: false,
                key: 'startDate',
            },
            {
                isRequired: false,
                key: 'endDate',
            },
            {
                isRequired: false,
                key: 'period',
            },
            {
                isRequired: false,
                key: 'displayedShapesLeft',
            },
            {
                isRequired: false,
                key: 'zoomLeft',
            },
            {
                isRequired: false,
                key: 'centerLeft',
            },
            {
                isRequired: false,
                key: 'zoomRight',
            },
            {
                isRequired: false,
                key: 'centerRight',
            },
            {
                isRequired: false,
                key: 'displayedShapesRight',
            },
            {
                isRequired: false,
                key: 'leftTab',
            },
            {
                isRequired: false,
                key: 'rightTab',
            },
        ],
    },
    {
        baseUrl: IM_OHH,
        component: props => <ImStats {...props} imType="imOHH" />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'imType',
            },
            {
                isRequired: false,
                key: 'campaign',
            },
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'rounds',
            },
        ],
    },
    {
        baseUrl: IM_IHH,
        component: props => <ImStats {...props} imType="imIHH" />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'campaign',
            },
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'rounds',
            },
        ],
    },
    {
        baseUrl: IM_GLOBAL,
        component: props => <ImStats {...props} imType="imGlobal" />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: 'campaign',
            },
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'rounds',
            },
        ],
    },
    {
        baseUrl: BUDGET,
        component: props => <BudgetList {...props} />,
        permissions: ['iaso_polio_budget'],
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'search',
            },
            {
                isRequired: false,
                key: 'budget_current_state_key__in',
            },
            {
                isRequired: false,
                key: 'roundStartFrom',
            },
            {
                isRequired: false,
                key: 'roundStartTo',
            },
            {
                isRequired: false,
                key: 'country__id__in',
            },
            {
                isRequired: false,
                key: 'orgUnitGroups',
            },
        ],
    },
    {
        baseUrl: BUDGET_DETAILS,
        component: props => <BudgetDetails {...props} />,
        permissions: ['iaso_polio_budget'],
        params: [
            ...paginationPathParams,

            {
                isRequired: false,
                key: 'campaignName',
            },
            {
                isRequired: false,
                key: 'campaignId',
            },
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'show_hidden',
            },
            {
                isRequired: false,
                key: 'action',
            },
            {
                isRequired: false,
                key: 'quickTransition',
            },
            {
                isRequired: false,
                key: 'previousStep',
            },
            {
                isRequired: false,
                key: 'transition_key',
            },
        ],
    },
    {
        baseUrl: NOPV2_AUTH,
        component: props => <Nopv2Authorisations {...props} />,
        permissions: ['iaso_polio'],
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'auth_status',
            },
            {
                isRequired: false,
                key: 'block_country',
            },
        ],
    },
    {
        baseUrl: NOPV2_AUTH_DETAILS,
        component: props => <Nopv2AuthorisationsDetails {...props} />,
        permissions: ['iaso_polio'],
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'country',
            },
            {
                isRequired: false,
                key: 'countryName',
            },
        ],
    },
    {
        baseUrl: VACCINE_SUPPLY_CHAIN,
        component: props => <VaccineSupplyChain {...props} />,
        permissions: ['iaso_polio_vaccine_supply_chain_read'],
        params: [
            ...paginationPathParams,

            {
                isRequired: false,
                key: 'search',
            },
            {
                isRequired: false,
                key: 'campaign__country',
            },
            {
                isRequired: false,
                key: 'vaccine_type',
            },
            {
                isRequired: false,
                key: 'rounds__started_at__gte',
            },
            {
                isRequired: false,
                key: 'rounds__started_at__lte',
            },
        ],
    },
    {
        baseUrl: STOCK_MANAGEMENT,
        component: props => <VaccineStockManagement {...props} />,
        permissions: ['iaso_polio'],
        params: [
            ...paginationPathParams,
            {
                isRequired: false,
                key: 'search',
            },
            {
                isRequired: false,
                key: 'country_id',
            },
            {
                isRequired: false,
                key: 'vaccine_type',
            },
        ],
    },
    {
        baseUrl: STOCK_MANAGEMENT_DETAILS,
        component: props => <VaccineStockManagementDetails {...props} />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: `id`,
            },
            {
                isRequired: false,
                key: `tab`,
            },
            {
                isRequired: false,
                key: `${USABLE_VIALS}Order`,
            },
            {
                isRequired: false,
                key: `${USABLE_VIALS}PageSize`,
            },
            {
                isRequired: false,
                key: `${USABLE_VIALS}Page`,
            },
            {
                isRequired: false,
                key: `${UNUSABLE_VIALS}Order`,
            },
            {
                isRequired: false,
                key: `${UNUSABLE_VIALS}PageSize`,
            },
            {
                isRequired: false,
                key: `${UNUSABLE_VIALS}Page`,
            },
        ],
    },
    {
        baseUrl: STOCK_VARIATION,
        component: props => <VaccineStockVariation {...props} />,
        permissions: ['iaso_polio'],
        params: [
            {
                isRequired: false,
                key: `id`,
            },
            {
                isRequired: false,
                key: `tab`,
            },
            {
                isRequired: false,
                key: `${FORM_A}Order`,
            },
            {
                isRequired: false,
                key: `${FORM_A}PageSize`,
            },
            {
                isRequired: false,
                key: `${FORM_A}Page`,
            },
            {
                isRequired: false,
                key: `${DESTRUCTION}Order`,
            },
            {
                isRequired: false,
                key: `${DESTRUCTION}PageSize`,
            },
            {
                isRequired: false,
                key: `${DESTRUCTION}Page`,
            },
            {
                isRequired: false,
                key: `${INCIDENT}Order`,
            },
            {
                isRequired: false,
                key: `${INCIDENT}PageSize`,
            },
            {
                isRequired: false,
                key: `${INCIDENT}Page`,
            },
        ],
    },
    {
        baseUrl: VACCINE_SUPPLY_CHAIN_DETAILS,
        component: props => <VaccineSupplyChainDetails {...props} />,
        permissions: ['iaso_polio_vaccine_supply_chain_write'],
        params: [
            { isRequired: false, key: 'id' },
            { isRequired: false, key: 'tab' },
        ],
    },
    {
        baseUrl: CONFIG_COUNTRY_URL,
        component: () => <CountryNotificationsConfig />,
        permissions: ['iaso_polio_config'],
        params: [...paginationPathParams],
    },
    {
        baseUrl: CONFIG_REASONS_FOR_DELAY_URL,
        component: props => <ReasonsForDelay {...props} />,
        permissions: ['iaso_polio_config'],
        params: [
            {
                isRequired: false,
                key: 'order',
            },
            {
                isRequired: false,
                key: 'page',
            },
            {
                isRequired: false,
                key: 'pageSize',
            },
        ],
    },
    {
        allowAnonymous: true,
        baseUrl: 'polio/embeddedCalendar',
        component: props => <Calendar {...props} embedded />,
        params: [
            {
                isRequired: false,
                key: 'currentDate',
            },
            {
                isRequired: false,
                key: 'order',
            },
            ...campaignsFilters,
            {
                isRequired: false,
                key: 'orgUnitGroups',
            },
        ],
        isRootUrl: false,
    },
    {
        baseUrl: NOTIFICATIONS_BASE_URL,
        component: props => <Notifications {...props} />,
        permissions: ['iaso_polio_notifications'],
        params: [
            { isRequired: false, key: 'order' },
            { isRequired: false, key: 'page' },
            { isRequired: false, key: 'pageSize' },
            { isRequired: false, key: 'vdpv_category' },
            { isRequired: false, key: 'source' },
            { isRequired: false, key: 'country' },
            { isRequired: false, key: 'date_of_onset_after' },
            { isRequired: false, key: 'date_of_onset_before' },
        ],
    },
];

const menu = [
    {
        label: MESSAGES.polio,
        key: 'polio',
        icon: props => <DataSourceIcon {...props} />,
        subMenu: [
            {
                label: MESSAGES.campaigns,
                key: 'list',
                permissions: ['iaso_polio'],
                icon: props => <FormatListBulleted {...props} />,
            },
            {
                label: MESSAGES.groupedCampaigns,
                key: 'groupedcampaigns',
                permissions: ['iaso_polio'],
                icon: props => <GroupWork {...props} />,
            },
            {
                label: MESSAGES.calendar,
                key: 'calendar',
                permissions: ['iaso_polio'],
                icon: props => <CalendarToday {...props} />,
            },
            {
                label: MESSAGES.lqas,
                key: 'lqas',
                permissions: ['iaso_polio'],
                icon: props => <AssessmentIcon {...props} />,
                subMenu: [
                    {
                        label: MESSAGES.byCountry,
                        key: 'lqas',
                        permissions: ['iaso_polio'],
                        icon: props => <PhotoSizeSelectActualIcon {...props} />,
                    },
                    {
                        label: MESSAGES.map,
                        key: 'lqas-map',
                        permissions: ['iaso_polio'],
                        icon: props => <PublicIcon {...props} />,
                    },
                ],
            },
            {
                label: MESSAGES.im,
                key: 'im',
                icon: props => <DonutSmallIcon {...props} />,
                subMenu: [
                    {
                        label: MESSAGES.imGlobal,
                        key: 'global',
                        permissions: ['iaso_polio'],
                        icon: props => <HomeWorkIcon {...props} />,
                    },
                    {
                        label: MESSAGES.imIHH,
                        key: 'ihh',
                        permissions: ['iaso_polio'],
                        icon: props => <HomeIcon {...props} />,
                    },
                    {
                        label: MESSAGES.imOHH,
                        key: 'ohh',
                        permissions: ['iaso_polio'],
                        icon: props => <StorefrontIcon {...props} />,
                    },
                ],
            },
            {
                label: MESSAGES.budget,
                key: 'budget',
                permissions: ['iaso_polio_budget'],
                icon: props => <AccountBalanceWalletIcon {...props} />,
            },
            {
                label: MESSAGES.vaccinemodule,
                key: 'vaccinemodule',
                icon: props => <ExtensionIcon {...props} />,
                subMenu: [
                    {
                        label: MESSAGES.nopv2Auth,
                        key: 'nopv2authorisation',
                        permissions: [
                            'iaso_polio_vaccine_authorizations_read_only',
                        ],
                        icon: props => <MenuBookIcon {...props} />,
                    },
                    {
                        label: MESSAGES.vaccineSupplyChain,
                        key: 'supplychain',
                        // using read permission to grant access
                        // because backend won't accept fetching with write permission only
                        permissions: ['iaso_polio_vaccine_supply_chain_read'],
                        icon: props => <LocalShippingIcon {...props} />,
                    },
                    {
                        label: MESSAGES.vaccineStockManagement,
                        key: 'stockmanagement',
                        dev: true,
                        permissions: ['iaso_polio'],
                        icon: props => <StorageIcon {...props} />,
                    },
                ],
            },
            {
                label: MESSAGES.notifications,
                key: 'notifications',
                permissions: ['iaso_polio_notifications'],
                icon: props => <NotificationsActiveIcon {...props} />,
            },
            {
                label: MESSAGES.configuration,
                key: 'config',
                permissions: ['iaso_polio_config'],
                icon: props => <SettingsIcon {...props} />,
                subMenu: [
                    {
                        label: MESSAGES.country,
                        key: 'country',
                        permissions: ['iaso_polio_config'],
                        icon: props => <PhotoSizeSelectActualIcon {...props} />,
                    },
                    {
                        label: MESSAGES.reasonsForDelay,
                        key: 'reasonsfordelay',
                        permissions: ['iaso_polio_config'],
                        icon: props => <WatchLaterIcon {...props} />,
                    },
                ],
            },
        ],
    },
];

const translations = {
    fr,
    en,
};

export default {
    routes,
    menu,
    translations,
    homeUrl: `${DASHBOARD_BASE_URL}`,
    // homeOffline: () => <div>OFFLINE</div>,
    // homeOnline: () => <div>CONNECTED HOME POLIO</div>,
};