import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { useLocation, useParams } from 'react-router';
import SidebarMenu from '../../app/components/SidebarMenuComponent';

import { redirectToReplace } from '../../../routing/actions.ts';

import { userHasOneOfPermissions, getFirstAllowedUrl } from '../utils';

import PageError from '../../../components/errors/PageError';
import { switchLocale } from '../../app/actions';
import { hasFeatureFlag } from '../../../utils/featureFlags';
import { useCurrentUser } from '../../../utils/usersUtils.ts';
import { WrongAccountModal } from './WrongAccountModal.tsx';
import PageNoPerms from '../../../components/errors/PageNoPerms.tsx';

const ProtectedRoute = ({ routeConfig, allRoutes, component }) => {
    const location = useLocation();
    const params = useParams();
    const { featureFlag, permissions, isRootUrl, baseUrl } = routeConfig;
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();

    const isWrongAccount = Boolean(
        params.accountId && params.accountId !== `${currentUser.account.id}`,
    );

    // useEffect(() => {
    //     if (!params.accountId && currentUser.account) {
    //         dispatch(
    //             redirectToReplace(baseUrl, {
    //                 ...params,
    //                 accountId: currentUser.account.id,
    //             }),
    //         );
    //     }
    // }, [currentUser.account, baseUrl, params, dispatch]);

    useEffect(() => {
        // Use defined default language if it exists and if the user didn't set it manually
        if (currentUser.language) {
            dispatch(switchLocale(currentUser.language));
        }
    }, [currentUser.language, dispatch]);

    let isAuthorized =
        permissions.length > 0
            ? userHasOneOfPermissions(permissions, currentUser)
            : true;
    if (featureFlag && !hasFeatureFlag(currentUser, featureFlag)) {
        isAuthorized = false;
    }
    useEffect(() => {
        if (!isAuthorized && isRootUrl) {
            const newBaseUrl = getFirstAllowedUrl(
                permissions,
                currentUser.permissions ?? [],
                allRoutes,
            );
            if (newBaseUrl) {
                dispatch(redirectToReplace(newBaseUrl, {}));
            }
        }
    }, [
        allRoutes,
        currentUser,
        dispatch,
        isAuthorized,
        isRootUrl,
        permissions,
    ]);

    // this should kick in if the above effect didn't redirect the user to a better page
    const hasNoPermWarning =
        isRootUrl &&
        (!currentUser.permissions ||
            (currentUser.permissions.length === 0 && !isAuthorized));
    if (!currentUser) {
        return null;
    }
    return (
        <>
            <SidebarMenu location={location} />
            <WrongAccountModal isOpen={isWrongAccount} />
            {isAuthorized && component}
            {hasNoPermWarning && <PageNoPerms />}
            {!isAuthorized && !hasNoPermWarning && (
                <PageError errorCode="403" />
            )}
        </>
    );
};
ProtectedRoute.defaultProps = {
    allRoutes: [],
};

ProtectedRoute.propTypes = {
    component: PropTypes.node.isRequired,
    allRoutes: PropTypes.array,
    routeConfig: PropTypes.object.isRequired,
};

export default ProtectedRoute;
