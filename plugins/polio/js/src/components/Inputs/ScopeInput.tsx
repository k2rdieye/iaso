/* eslint-disable camelcase */
import React, {
    FunctionComponent,
    useCallback,
    useState,
    ReactNode,
} from 'react';
import { useField, FieldProps } from 'formik';
import {
    // @ts-ignore
    LoadingSpinner,
    // @ts-ignore
    useSafeIntl,
} from 'bluesquare-components';
import {
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
    Box,
} from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';

// @ts-ignore
import InputComponent from 'Iaso/components/forms/InputComponent';
import MESSAGES from '../../constants/messages';

import { DistrictScopeTable } from '../Scopes/DistrictScopeTable';
import { MapScope } from '../Scopes/MapScope';

import { Scope, Shape, Values, FilteredDistricts } from '../Scopes/types';

type ExtraProps = {
    filteredDistricts: FilteredDistricts[];
    // eslint-disable-next-line no-unused-vars
    searchScope: boolean;
    onChangeSearchScope: () => void;
    isFetchingDistricts: boolean;
    isFetchingRegions: boolean;
    districtShapes?: FilteredDistricts[];
    regionShapes?: Shape[];
    searchComponent: ReactNode;
    page: number;
    // eslint-disable-next-line no-unused-vars
    setPage: (page: number) => void;
};

type Props = FieldProps<Scope[], Values> & ExtraProps;

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
    const [selectedVaccine, setSelectedVaccine] = useState<string>('mOPV2');
    const [, , helpers] = useField(field.name);
    const { formatMessage } = useSafeIntl();
    const { value: scopes = [] } = field;
    const { setValue: setScopes } = helpers;

    const isFetching = isFetchingDistricts || isFetchingRegions;

    const toggleRegionSelect = () => {
        setSelectRegion(!selectRegion);
    };

    const toggleRegion = (
        selectOrgUnit: Shape,
        _selectedVaccine,
        allDistricts: Shape[],
    ) => {
        const OrgUnitsIdInSameRegion: number[] = allDistricts
            .filter(s => s.parent_id === selectOrgUnit.parent_id)
            .map(s => s.id);
        const newScopes: Scope[] = cloneDeep(scopes);
        // Find scope for vaccine
        let scope: Scope | undefined = newScopes.find(
            s => s.vaccine === _selectedVaccine,
        );
        if (!scope) {
            scope = {
                vaccine: _selectedVaccine,
                group: {
                    org_units: [],
                },
            };
            newScopes.push(scope);
        }
        // if all the orgunits from this region are already in this vaccine scope, remove them
        // @ts-ignore
        if (
            OrgUnitsIdInSameRegion.every(OrgUnitId =>
                // @ts-ignore
                scope.group.org_units.includes(OrgUnitId),
            )
        ) {
            const orgUnits: Array<number> = [];

            scope.group.org_units.forEach(OrgUnitId => {
                if (!OrgUnitsIdInSameRegion.includes(OrgUnitId)) {
                    orgUnits.push(OrgUnitId);
                }
            });
            scope.group.org_units = orgUnits;
        } else {
            // Remove the OrgUnits from all the scopes
            newScopes.forEach(s => {
                const newScope = { ...s };
                newScope.group.org_units = s.group.org_units.filter(
                    OrgUnitId => !OrgUnitsIdInSameRegion.includes(OrgUnitId),
                );
            });

            // Add the OrgUnit in the scope for selected vaccine
            scope.group.org_units = [
                ...scope.group.org_units,
                ...OrgUnitsIdInSameRegion,
            ];
        }
        setScopes(newScopes);
    };

    const toggleDistrictInVaccineScope = useCallback(
        (district, _selectedVaccine) => {
            const newScopes: Scope[] = cloneDeep(scopes);
            let scope: Scope | undefined = newScopes.find(
                s => s.vaccine === _selectedVaccine,
            );

            if (!scope) {
                scope = {
                    vaccine: _selectedVaccine,
                    group: {
                        org_units: [],
                    },
                };
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
                scope.group.org_units = [...scope.group.org_units, district.id];
            }
            setScopes(newScopes);
        },
        [scopes, setScopes],
    );

    const onSelectOrgUnit = shape => {
        if (selectRegion && districtShapes) {
            toggleRegion(shape, selectedVaccine, districtShapes);
        } else {
            toggleDistrictInVaccineScope(shape, selectedVaccine);
        }
    };

    return (
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
                    toggleDistrictInVaccineScope={shape =>
                        toggleDistrictInVaccineScope(shape, selectedVaccine)
                    }
                    toggleRegion={shape =>
                        toggleRegion(
                            shape,
                            selectedVaccine,
                            districtShapes || [],
                        )
                    }
                    setPage={setPage}
                    page={page}
                    isFetching={isFetching}
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
    );
};
