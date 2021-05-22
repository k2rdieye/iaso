import React from 'react';
import tableColumns from './config';
import DeleteDialog from '../../../components/dialogs/DeleteDialogComponent';

import OrgUnitsTypesDialog from './components/OrgUnitsTypesDialog';
import IconButtonComponent from '../../../components/buttons/IconButtonComponent';

let cols;
let wrapper;
let button;
let orgUnitsTypesDialog;
const fetchOrgUnitTypesSpy = sinon.spy();
const deleteOrgUnitTypeSpy = sinon.spy();
const deletePromise = () => {
    deleteOrgUnitTypeSpy();
    return new Promise(resolve => {
        resolve();
    });
};
describe('Org unit types config', () => {
    it('sould return an array of 8 columns', () => {
        cols = tableColumns(() => null, {
            props: {
                params: {},
            },
            fetchOrgUnitTypes: () => fetchOrgUnitTypesSpy(),
            deleteOrgUnitType: () => deletePromise(),
        });
        expect(cols).to.have.lengthOf(8);
    });
    it('should render a component if Cell is defined', () => {
        cols.forEach(c => {
            if (c.Cell) {
                const cell = c.Cell({
                    original: {
                        projects: [
                            {
                                name: 'LINK',
                            },
                        ],
                    },
                });
                expect(cell).to.exist;
            }
        });
    });
    it('should render a component if Cell is defined and no depth', () => {
        const depthColumn = cols[3];
        wrapper = shallow(
            depthColumn.Cell({
                original: {
                    depth: null,
                },
            }),
        );
        expect(wrapper).to.exist;
    });
    it('should call fetchOrgUnitTypes on click on onConfirmed', () => {
        const actionColumn = cols[cols.length - 1];
        wrapper = shallow(
            actionColumn.Cell({
                original: {
                    projects: [],
                },
            }),
        );
        orgUnitsTypesDialog = wrapper.find(OrgUnitsTypesDialog);

        expect(orgUnitsTypesDialog).to.have.lengthOf(1);
        orgUnitsTypesDialog.props().onConfirmed();
        expect(fetchOrgUnitTypesSpy).to.have.been.called;
    });
    it('should call fetchOrgUnitTypes on click on edit icon ', () => {
        const openDialogSpy = sinon.spy();
        wrapper = shallow(
            <div>
                {orgUnitsTypesDialog
                    .props()
                    .renderTrigger({ openDialog: () => openDialogSpy() })}
            </div>,
        );
        button = wrapper.find(IconButtonComponent);

        expect(button).to.have.lengthOf(1);
        button.props().onClick();
        expect(openDialogSpy).to.have.been.called;
    });
    it('should call fetchOrgUnitTypes on click on onConfirmed', () => {
        const actionColumn = cols[cols.length - 1];
        const closeDialogSpy = sinon.spy();
        wrapper = shallow(
            actionColumn.Cell({
                original: {
                    projects: [],
                },
            }),
        );
        const deleteDialog = wrapper.find(DeleteDialog);

        expect(deleteDialog).to.have.lengthOf(1);
        deleteDialog.props().onConfirm(() => closeDialogSpy());
        expect(deleteOrgUnitTypeSpy).to.have.been.called;
    });
    after(() => {
        sinon.restore();
    });
});
