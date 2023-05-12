import React, { FunctionComponent, ReactNode } from 'react';
import { GeoJSON, Tooltip, Pane } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapColor, Shape } from '../../constants/types';
import { findBackgroundShape } from './utils';

type Props = {
    mainLayer?: Shape[];
    backgroundLayer?: Shape[];
    // eslint-disable-next-line no-unused-vars
    getMainLayerStyle?: (shape: Shape) => MapColor;
    // eslint-disable-next-line no-unused-vars
    getBackgroundLayerStyle?: (shape: Shape) => MapColor;
    tooltipLabels?: { main: string; background: string };
    name?: string;
    // eslint-disable-next-line no-unused-vars
    makePopup?: (shape: Shape) => ReactNode;
    // eslint-disable-next-line no-unused-vars
    onSelectShape?: (shape: Shape) => void;
};

export const MapPanes: FunctionComponent<Props> = ({
    mainLayer,
    backgroundLayer,
    getMainLayerStyle = () => null,
    getBackgroundLayerStyle = () => null,
    tooltipLabels,
    name = 'Map',
    makePopup,
    onSelectShape = () => null,
}) => {
    return (
        <>
            <Pane name={`BackgroundLayer-${name}`}>
                {(backgroundLayer?.length ?? 0) > 0 &&
                    backgroundLayer?.map(shape => (
                        <GeoJSON
                            key={shape.id}
                            data={shape.geo_json}
                            style={() => getBackgroundLayerStyle(shape)}
                            onClick={() => null}
                        />
                    ))}
            </Pane>
            <Pane name={`MainLayer-${name}`}>
                {(mainLayer?.length ?? 0) > 0 &&
                    mainLayer?.map(shape => (
                        <GeoJSON
                            key={shape.id}
                            data={shape.geo_json}
                            style={() => getMainLayerStyle(shape)}
                            onClick={() => onSelectShape(shape)}
                        >
                            {makePopup && makePopup(shape)}
                            <Tooltip title={shape.name}>
                                {(backgroundLayer?.length ?? 0) > 0 && (
                                    <span>
                                        {tooltipLabels &&
                                            `${
                                                tooltipLabels.background
                                            }: ${findBackgroundShape(
                                                shape,
                                                // backgroundLayer cannot be undefined because this code will only run if it is not.
                                                // @ts-ignore
                                                backgroundLayer,
                                            )} > `}
                                    </span>
                                )}
                                <span>
                                    {tooltipLabels &&
                                        `${tooltipLabels.main}: ${shape.name}`}
                                    {!tooltipLabels && `${shape.name}`}
                                </span>
                            </Tooltip>
                        </GeoJSON>
                    ))}
            </Pane>
        </>
    );
};
