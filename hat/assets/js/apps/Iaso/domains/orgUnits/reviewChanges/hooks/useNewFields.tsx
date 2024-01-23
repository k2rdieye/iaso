import React, {
    ReactElement,
    useMemo,
    useState,
    FunctionComponent,
} from 'react';
import { textPlaceholder, useSafeIntl } from 'bluesquare-components';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Box } from '@mui/material';
import {
    InstanceForChangeRequest,
    NestedGroup,
    NestedOrgUnitType,
    NestedLocation,
    OrgUnitChangeRequestDetails,
} from '../types';
import { MarkerMap } from '../../../../components/maps/MarkerMapComponent';
import { LinkToOrgUnit } from '../../components/LinkToOrgUnit';
import { ShortOrgUnit } from '../../types/orgUnit';
import MESSAGES from '../messages';
import InstanceDetail from '../../../instances/compare/components/InstanceDetail';

export type NewOrgUnitField = {
    key: string;
    isChanged: boolean;
    isSelected: boolean;
    newValue: ReactElement | string;
    oldValue: ReactElement | string;
    label: string;
    removePadding?: boolean;
    order: number;
};

type UseNewFields = {
    newFields: NewOrgUnitField[];
    // eslint-disable-next-line no-unused-vars
    setSelected: (key: string) => void;
};

type ReferenceInstancesProps = {
    instances: InstanceForChangeRequest[];
};

const ReferenceInstances: FunctionComponent<ReferenceInstancesProps> = ({
    instances,
}) => {
    return (
        <>
            {!instances || (instances.length === 0 && textPlaceholder)}
            {instances.map(instance => (
                <Box mb={1}>
                    <InstanceDetail
                        key={instance.id}
                        instanceId={`${instance.id}`}
                        minHeight="150px"
                        titleVariant="subtitle1"
                    />
                </Box>
            ))}
        </>
    );
};
const getGroupsValue = (groups: NestedGroup[]): ReactElement | string => {
    return groups && groups.length > 0
        ? groups.map(group => group.name).join(', ')
        : textPlaceholder;
};

const getLocationValue = (location: NestedLocation): ReactElement => {
    return (
        <MarkerMap
            longitude={location.longitude}
            latitude={location.latitude}
            maxZoom={8}
            mapHeight={300}
        />
    );
};

export const useNewFields = (
    changeRequest?: OrgUnitChangeRequestDetails,
): UseNewFields => {
    const { formatMessage } = useSafeIntl();
    const [fields, setFields] = useState<NewOrgUnitField[]>([]);

    useMemo(() => {
        if (!changeRequest) {
            setFields([]);
            return;
        }
        const orgUnit = changeRequest.org_unit;
        const fieldDefinitions = {
            new_name: {
                label: formatMessage(MESSAGES.name),
                order: 1,
                formatValue: val => <span>{val.toString()}</span>,
            },
            new_parent: {
                label: formatMessage(MESSAGES.parent),
                order: 3,
                formatValue: val => (
                    <LinkToOrgUnit orgUnit={val as ShortOrgUnit} />
                ),
            },
            new_org_unit_type: {
                label: formatMessage(MESSAGES.orgUnitsType),
                order: 2,
                formatValue: val => (
                    <span>{(val as NestedOrgUnitType).short_name}</span>
                ),
            },
            new_groups: {
                label: formatMessage(MESSAGES.groups),
                order: 4,
                formatValue: val => (
                    <span>{getGroupsValue(val as NestedGroup[])}</span>
                ),
            },
            new_location: {
                label: formatMessage(MESSAGES.location),
                order: 5,
                formatValue: val => getLocationValue(val as NestedLocation),
                removePadding: true,
            },
            new_opening_date: {
                label: formatMessage(MESSAGES.openingDate),
                order: 6,
                formatValue: val => <span>{moment(val).format('LTS')}</span>,
            },
            new_closed_date: {
                label: formatMessage(MESSAGES.closingDate),
                order: 7,
                formatValue: val => <span>{moment(val).format('LTS')}</span>,
            },
            new_reference_instances: {
                label: formatMessage(MESSAGES.multiReferenceInstancesLabel),
                order: 8,
                formatValue: val => (
                    <ReferenceInstances
                        instances={val as InstanceForChangeRequest[]}
                    />
                ),
                removePadding: true,
            },
        };

        const newFields = orderBy(
            Object.entries(changeRequest).reduce<NewOrgUnitField[]>(
                (acc, [key, value]) => {
                    const originalKey = key.replace('new_', '');
                    const fieldDef = fieldDefinitions[key];
                    if (fieldDef) {
                        const oldValue = orgUnit[originalKey]
                            ? fieldDef.formatValue(orgUnit[originalKey])
                            : textPlaceholder;
                        const newValue = value
                            ? fieldDef.formatValue(value)
                            : oldValue;
                        const isChanged = Boolean(value);
                        const { label, order } = fieldDef;
                        acc.push({
                            key: originalKey,
                            label,
                            isChanged,
                            isSelected: false,
                            newValue,
                            oldValue,
                            order,
                            ...(fieldDef.removePadding && {
                                removePadding: true,
                            }),
                        });
                    }
                    return acc;
                },
                [],
            ),
            ['order'],
            ['asc'],
        );

        setFields(newFields);
    }, [changeRequest, formatMessage]);

    const setSelected = key => {
        setFields(currentFields =>
            currentFields.map(field =>
                field.key === key
                    ? { ...field, isSelected: !field.isSelected }
                    : field,
            ),
        );
    };
    return { newFields: fields, setSelected };
};
