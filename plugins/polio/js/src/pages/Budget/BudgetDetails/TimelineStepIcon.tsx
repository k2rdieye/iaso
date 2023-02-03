import React, { FunctionComponent } from 'react';
import { CheckCircleOutline } from '@material-ui/icons';
import FastForwardIcon from '@material-ui/icons/FastForward';
import ClearIcon from '@material-ui/icons/Clear';
import { useSafeIntl } from 'bluesquare-components';
import classnames from 'classnames';
import { Tooltip } from '@material-ui/core';
import { useStyles } from './BudgetTimeline';
import { BudgetCategoryItem } from '../types';
import MESSAGES from '../../../constants/messages';

type Props = {
    item: BudgetCategoryItem;
};

// TODO : double check what happens with multiple overrides (step skipped then cancelled for example)
export const TimelineStepIcon: FunctionComponent<Props> = ({ item }) => {
    const { formatMessage } = useSafeIntl();
    const classes = useStyles();

    if (item.skipped)
        return (
            <Tooltip
                arrow
                placement="top"
                title={formatMessage(MESSAGES.stepSkipped)}
            >
                <FastForwardIcon
                    className={classnames(
                        classes.taskIcon,
                        classes.overrideIcon,
                    )}
                />
            </Tooltip>
        );
    if (item.cancelled)
        return (
            <Tooltip
                arrow
                placement="top"
                title={formatMessage(MESSAGES.stepCancelled)}
            >
                <ClearIcon
                    className={classnames(
                        classes.taskIcon,
                        classes.overrideIcon,
                    )}
                />
            </Tooltip>
        );
    return (
        <CheckCircleOutline
            className={classnames(
                item.performed_by && classes.taskDone,
                !item.performed_by && classes.taskPending,
                classes.taskIcon,
            )}
        />
    );
};
