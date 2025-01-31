/* eslint-disable camelcase */
import { Box, FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { LoadingSpinner, useSafeIntl } from 'bluesquare-components';
import { FieldProps, useField } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import React, {
    FunctionComponent,
    ReactNode,
    useCallback,
    useState,
} from 'react';

// @ts-ignore
import InputComponent from 'Iaso/components/forms/InputComponent';
import MESSAGES from '../../../constants/messages';

import { DistrictScopeTable } from './Scopes/DistrictScopeTable';
import { MapScope } from './Scopes/MapScope';

import { OrgUnit } from '../../../../../../../hat/assets/js/apps/Iaso/domains/orgUnits/types/orgUnit';
import { CampaignFormValues, Scope, Vaccine } from '../../../constants/types';
import { useIsPolioCampaign } from '../hooks/useIsPolioCampaignCheck';
import { FilteredDistricts } from './Scopes/types';

type ExtraProps = {
    filteredDistricts: FilteredDistricts[];
    // eslint-disable-next-line no-unused-vars
    searchScope: boolean;
    onChangeSearchScope: () => void;
    isFetchingDistricts: boolean;
    isFetchingRegions: boolean;
    districtShapes?: OrgUnit[];
    regionShapes?: OrgUnit[];
    searchComponent: ReactNode;
    page: number;
    // eslint-disable-next-line no-unused-vars
    setPage: (page: number) => void;
};

type Props = FieldProps<Scope[], CampaignFormValues> & ExtraProps;

export const ScopeInput: FunctionComponent<Props> = ({
    field,
    form: { values },
    filteredDistricts,
    searchScope,
    onChangeSearchScope,
    isFetchingDistricts,
    isFetchingRegions,
    districtShapes,
    regionShapes,
    searchComponent,
    page,
    setPage,
}) => {
    const [selectRegion, setSelectRegion] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine>('nOPV2');
    const isPolio = useIsPolioCampaign(values);
    const [, , helpers] = useField(field.name);
    const { formatMessage } = useSafeIntl();
    const { value: scopes = [] } = field;
    const { setValue: setScopes } = helpers;

    const isFetching = isFetchingDistricts || isFetchingRegions;

    const toggleRegionSelect = () => {
        setSelectRegion(!selectRegion);
    };

    const toggleRegion = useCallback(
        (selectOrgUnit: FilteredDistricts) => {
            const orgUnitsIdInSameRegion: number[] = (districtShapes || [])
                .filter(s => s.parent_id === selectOrgUnit.parent_id)
                .map(s => s.id);
            const newScopes: Scope[] = cloneDeep(scopes);
            let scope: Scope | undefined;
            if (!isPolio) {
                [scope] = newScopes;
            } else {
                // Find scope for vaccine
                scope = newScopes.find(s => s.vaccine === selectedVaccine);
            }
            if (!scope) {
                scope = {
                    group: {
                        org_units: [],
                    },
                };
                if (isPolio) {
                    scope.vaccine = selectedVaccine;
                }
                newScopes.push(scope);
            }
            // if all the orgunits from this region are already in this vaccine scope, remove them
            // @ts-ignore
            if (
                orgUnitsIdInSameRegion.every(OrgUnitId =>
                    // @ts-ignore
                    scope.group.org_units.includes(OrgUnitId),
                )
            ) {
                const orgUnits: Array<number> = [];

                scope.group.org_units.forEach(OrgUnitId => {
                    if (!orgUnitsIdInSameRegion.includes(OrgUnitId)) {
                        orgUnits.push(OrgUnitId);
                    }
                });
                scope.group.org_units = orgUnits;
            } else {
                // Remove the OrgUnits from all the scopes
                newScopes.forEach(s => {
                    const newScope = { ...s };
                    newScope.group.org_units = s.group.org_units.filter(
                        OrgUnitId =>
                            !orgUnitsIdInSameRegion.includes(OrgUnitId),
                    );
                });

                // Add the OrgUnit in the scope for selected vaccine
                scope.group.org_units = [
                    ...scope.group.org_units,
                    ...orgUnitsIdInSameRegion,
                ];
            }
            setScopes(newScopes);
        },
        [districtShapes, isPolio, scopes, selectedVaccine, setScopes],
    );
    const toggleDistrictInVaccineScope = useCallback(
        district => {
            const newScopes: Scope[] = cloneDeep(scopes);
            // check if a scope exists for currently selected vaccine
            let scope: Scope | undefined;
            if (!isPolio) {
                [scope] = newScopes;
            } else {
                scope = newScopes.find(s => s.vaccine === selectedVaccine);
            }
            // if not create one that is initially empty
            if (!scope) {
                scope = {
                    group: {
                        org_units: [],
                    },
                };
                if (isPolio) {
                    scope.vaccine = selectedVaccine;
                }
                newScopes.push(scope);
            }
            // Remove org unit from selection if it's part of the scope
            if (scope.group.org_units.includes(district.id)) {
                scope.group.org_units = scope.group.org_units.filter(
                    OrgUnitId => OrgUnitId !== district.id,
                );
            } else {
                // Remove the orgunit from all the scope in case it's part of another scope
                newScopes.forEach(s => {
                    if (s.group.org_units.includes(district.id)) {
                        const newScope = { ...s };
                        newScope.group.org_units = s.group.org_units.filter(
                            OrgUnitId => OrgUnitId !== district.id,
                        );
                    }
                });
                // Add org unit to proper scope
                // scope.group.org_units = [...scope.group.org_units, district.id];
                scope.group.org_units = [...scope.group.org_units, district.id];
            }
            setScopes(newScopes);
        },
        [scopes, setScopes, selectedVaccine, isPolio],
    );

    const onSelectOrgUnit = useCallback(
        shape => {
            if (selectRegion && districtShapes) {
                toggleRegion(shape);
            } else {
                toggleDistrictInVaccineScope(shape);
            }
        },
        [
            districtShapes,
            selectRegion,
            toggleDistrictInVaccineScope,
            toggleRegion,
        ],
    );

    return (
        <Box width="100%" overflow="hidden">
            <Grid container spacing={2}>
                <Grid xs={5} item>
                    <Box mb={2} mt={2}>
                        {searchComponent}
                        <InputComponent
                            keyValue="searchScope"
                            type="checkbox"
                            withMarginTop={false}
                            onChange={onChangeSearchScope}
                            value={searchScope}
                            label={MESSAGES.searchInScopeOrAllDistricts}
                        />
                    </Box>
                    <DistrictScopeTable
                        field={field}
                        regionShapes={regionShapes || []}
                        filteredDistricts={filteredDistricts}
                        toggleDistrictInVaccineScope={
                            toggleDistrictInVaccineScope
                        }
                        toggleRegion={toggleRegion}
                        setPage={setPage}
                        page={page}
                        isFetching={isFetching}
                        districtShapes={districtShapes || []}
                        selectedVaccine={selectedVaccine}
                        isPolio={isPolio}
                    />
                </Grid>
                <Grid xs={7} item>
                    {isFetching && <LoadingSpinner />}
                    <MapScope
                        field={field}
                        values={values}
                        regionShapes={regionShapes || []}
                        districtShapes={districtShapes || []}
                        onSelectOrgUnit={onSelectOrgUnit}
                        selectedVaccine={selectedVaccine}
                        setSelectedVaccine={setSelectedVaccine}
                        isPolio={isPolio}
                    />
                    <FormGroup>
                        <FormControlLabel
                            style={{ width: 'max-content' }}
                            control={
                                <Switch
                                    size="medium"
                                    checked={selectRegion}
                                    onChange={toggleRegionSelect}
                                    color="primary"
                                />
                            }
                            label={formatMessage(MESSAGES.selectRegion)}
                        />
                    </FormGroup>
                </Grid>
            </Grid>
        </Box>
    );
};
