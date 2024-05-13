import React, { FunctionComponent } from 'react';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import {
    IconButton as IconButtonComponent,
    IntlMessage,
    textPlaceholder,
    useKeyPressListener,
} from 'bluesquare-components';

import { Link, useLocation } from 'react-router-dom';
import MESSAGES from './messages';

type Props = {
    condition: boolean;
    url: string;
    text?: string;
    useIcon?: boolean;
    className?: string;
    replace?: boolean;
    iconSize?: 'small' | 'medium' | 'large' | 'default' | 'inherit';
    size?: 'small' | 'medium' | 'large' | 'default' | 'inherit';
    tooltipMessage?: IntlMessage;
    color?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
};

const useStyles = makeStyles(() => ({
    link: {
        cursor: 'pointer',
    },
}));

export const LinkTo: FunctionComponent<Props> = ({
    condition,
    url,
    text,
    useIcon = false,
    className = '',
    replace = false,
    iconSize = 'medium',
    size = 'medium',
    target = '_self',
    color,
    tooltipMessage = MESSAGES.see,
}) => {
    const { pathname: location } = useLocation();
    const targetBlankEnabled = useKeyPressListener('Meta');
    const actualTarget = targetBlankEnabled ? '_blank' : target;
    const classes: Record<string, string> = useStyles();
    if (condition) {
        if (useIcon) {
            return (
                <IconButtonComponent
                    icon="remove-red-eye"
                    tooltipMessage={tooltipMessage}
                    iconSize={iconSize}
                    size={size}
                    location={location}
                    reloadDocument={targetBlankEnabled}
                    url={url}
                    replace={replace}
                    color={color}
                    target={actualTarget}
                />
            );
        }
        return (
            <Link
                className={classNames(className, classes.link)}
                reloadDocument={targetBlankEnabled}
                to={url}
                state={{ location }}
                replace={replace}
                target={actualTarget}
            >
                {text || textPlaceholder}
            </Link>
        );
    }
    if (useIcon) return null;
    return <>{text || textPlaceholder}</>;
};