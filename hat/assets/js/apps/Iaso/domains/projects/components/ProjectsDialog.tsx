import React, {
    ReactNode,
    FunctionComponent,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import get from 'lodash/get';
import { Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSafeIntl, IntlMessage } from 'bluesquare-components';
import ConfirmCancelDialogComponent from '../../../components/dialogs/ConfirmCancelDialogComponent';

import { ProjectInfos } from './ProjectInfos';
import { Form, ProjectFeatureFlags } from './ProjectFeatureFlags';

import { Project } from '../types/project';

import MESSAGES from '../messages';
import { useGetFeatureFlags } from '../hooks/requests';
import { FeatureFlag } from '../types/featureFlag';

type RenderTriggerProps = {
    openDialog: () => void;
};
type Tab = 'infos' | 'feature_flags';

type Props = {
    titleMessage: IntlMessage;
    // eslint-disable-next-line no-unused-vars
    renderTrigger: ({ openDialog }: RenderTriggerProps) => ReactNode;
    initialData?: Project | null;
    // eslint-disable-next-line no-unused-vars
    saveProject: (s: Project) => Promise<any>;
};

const useStyles = makeStyles(theme => ({
    tabs: {
        marginBottom: theme.spacing(4),
    },
    tab: {
        padding: 0,
        width: 'calc(100% / 3)',
        minWidth: 0,
    },
    root: {
        minHeight: 365,
        position: 'relative',
    },
    hiddenOpacity: {
        position: 'absolute',
        top: 0,
        left: -5000,
        zIndex: -10,
        opacity: 0,
    },
}));

const emptyProject = {
    id: { value: '', errors: [] },
    app_id: { value: '', errors: [] },
    name: { value: '', errors: [] },
    feature_flags: { value: [], errors: [] } as Form,
};

export const forbiddenCharacters = ['"', '?', '/', '%', '&', ' ', '-'];

export const containsForbiddenCharacter = (value: string): boolean => {
    for (let i = 0; i < value.length; i += 1) {
        if (forbiddenCharacters.includes(value[i])) return true;
    }
    return false;
};

const ProjectsDialog: FunctionComponent<Props> = ({
    titleMessage,
    renderTrigger,
    initialData = {
        name: null,
        app_id: null,
        feature_flags: [],
    },
    saveProject,
}) => {
    const { data: featureFlags, isFetching: isFetchingFeatureFlags } =
        useGetFeatureFlags();

    const { formatMessage } = useSafeIntl();
    const classes: Record<string, string> = useStyles();
    const initialProject = useCallback(
        app => {
            const pr = app || initialData || {};
            return {
                id: { value: get(pr, 'id', null), errors: [] },
                app_id: { value: get(pr, 'app_id', ''), errors: [] },
                name: {
                    value: get(pr, 'name', ''),
                    errors: [],
                },
                feature_flags: {
                    value: get(pr, 'feature_flags', [] as FeatureFlag[]).map(
                        (v: FeatureFlag): number => v.id,
                    ),
                    errors: [],
                },
            };
        },
        [initialData],
    );
    const [project, setProject] = useState(emptyProject);
    const [tab, setTab] = useState<Tab>('infos');
    const appIdError = formatMessage(MESSAGES.appIdError);

    const onClosed = () => {
        setProject(initialProject(null));
        setTab('infos');
    };

    const setFieldValue = useCallback(
        (fieldName, fieldValue) => {
            setProject({
                ...project,
                [fieldName]: {
                    value: fieldValue,
                    errors: [],
                },
            });
        },
        [project],
    );

    const setInfoFieldValue = useCallback(
        (fieldName, fieldValue) => {
            const errors: unknown[] = [];
            const hasForbiddenChar = containsForbiddenCharacter(fieldValue);
            if (fieldName === 'app_id' && hasForbiddenChar) {
                errors.push(appIdError);
            }
            setProject({
                ...project,
                [fieldName]: {
                    value: fieldValue,
                    errors,
                },
            });
        },
        [appIdError, project],
    );

    const setFieldErrors = useCallback(
        (fieldName, fieldError) => {
            setProject({
                ...project,
                [fieldName]: {
                    value: project[fieldName].value,
                    errors: [fieldError],
                },
            });
        },
        [project],
    );

    const onConfirm = closeDialog => {
        const currentProject: Project = {
            id: initialData?.app_id,
            feature_flags: (featureFlags ?? []).filter(fF =>
                project.feature_flags.value.includes(fF.id),
            ),
            app_id: project.app_id.value || '',
            name: project.name.value || '',
            old_app_id: initialData?.app_id,
        };
        saveProject(currentProject)
            .then(() => {
                closeDialog();
                setTab('infos');
                setProject(initialProject(null));
            })
            .catch(error => {
                if (error.status === 400) {
                    Object.keys(error.details).forEach(errorKey => {
                        setFieldErrors(errorKey, error.details[errorKey]);
                    });
                }
            });
    };
    useEffect(() => {
        setProject(initialProject(initialData));
    }, [initialData, initialProject]);

    const allowConfirm = useMemo(
        () =>
            project &&
            project.name &&
            project.name.value !== '' &&
            project.app_id &&
            project.app_id.value !== '' &&
            project.app_id.errors.length === 0 &&
            !isFetchingFeatureFlags,
        [project, isFetchingFeatureFlags],
    );

    return (
        // @ts-ignore
        <ConfirmCancelDialogComponent
            allowConfirm={allowConfirm}
            titleMessage={titleMessage}
            onConfirm={closeDialog => onConfirm(closeDialog)}
            cancelMessage={MESSAGES.cancel}
            confirmMessage={MESSAGES.save}
            onClosed={() => onClosed()}
            renderTrigger={renderTrigger}
            maxWidth="xs"
            dialogProps={{
                classNames: classes.dialog,
            }}
        >
            <div className={classes.root} id="project-dialog">
                <Tabs
                    value={tab}
                    classes={{
                        root: classes.tabs,
                    }}
                    onChange={(_event, newtab) => setTab(newtab)}
                >
                    <Tab
                        classes={{
                            root: classes.tab,
                        }}
                        value="infos"
                        label={formatMessage(MESSAGES.infos)}
                    />
                    <Tab
                        classes={{
                            root: classes.tab,
                        }}
                        value="feature_flags"
                        label={formatMessage(MESSAGES.featureFlags)}
                    />
                </Tabs>
                {tab === 'infos' && (
                    <ProjectInfos
                        setFieldValue={setInfoFieldValue}
                        currentProject={project}
                    />
                )}
                {tab === 'feature_flags' && (
                    <ProjectFeatureFlags
                        setFieldValue={(_key, value) =>
                            setFieldValue('feature_flags', value)
                        }
                        currentProject={project}
                        featureFlags={featureFlags}
                        isFetchingFeatureFlag={isFetchingFeatureFlags}
                    />
                )}
            </div>
        </ConfirmCancelDialogComponent>
    );
};

ProjectsDialog.defaultProps = {
    initialData: null,
};

export { ProjectsDialog };
