import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function ExcellSvg(props) {
    const finalProps = {
        ...props,
        viewBox: '-7 -3 40 40',
    };
    return (
        <SvgIcon {...finalProps}>
            <g>
                <path
                    d="M11.15,0L3.011,8.592v22.834h25.403V0H11.15z M10.434,3.613v3.808H6.826L10.434,3.613z M26.449,29.462H4.977V9.385h7.421
                V1.964h14.053v27.498H26.449z"
                />
                <path
                    d="M15.004,14.766h0.491v-1.768H9.444v1.768h0.737c0.202,0,0.402,0.055,0.617,0.168c0.203,0.107,0.396,0.306,0.572,0.585
                l2.919,4.738l-2.939,4.21c-0.16,0.229-0.306,0.421-0.438,0.576c-0.113,0.133-0.228,0.242-0.337,0.321
                c-0.098,0.07-0.198,0.119-0.307,0.148c-0.127,0.034-0.282,0.051-0.462,0.051H9.198v1.769h5.438v-1.276l-0.055-0.49H14.09
                c-0.449,0-0.643-0.057-0.724-0.094c0-0.053,0.01-0.115,0.028-0.186c0.024-0.088,0.055-0.176,0.095-0.264
                c0.043-0.097,0.087-0.188,0.138-0.279c0.046-0.084,0.091-0.159,0.139-0.229l1.65-2.44l1.769,2.843
                c0.068,0.114,0.123,0.209,0.159,0.289c0.036,0.077,0.05,0.121,0.054,0.139l0.013,0.108c0,0-0.112,0.113-0.625,0.113h-0.592v1.768
                h6.033v-1.768h-0.729c-0.144,0-0.3-0.052-0.464-0.151c-0.133-0.08-0.35-0.259-0.616-0.613l-3.272-5.259l2.529-3.646
                c0.164-0.238,0.314-0.437,0.452-0.594c0.125-0.142,0.246-0.26,0.362-0.349c0.092-0.069,0.182-0.116,0.272-0.142
                c0.104-0.03,0.226-0.045,0.361-0.045h0.655v-1.768h-5.074v1.277l0.055,0.491h0.491c0.125,0,0.237,0.006,0.341,0.02
                c0.091,0.011,0.145,0.029,0.173,0.029h0.001c0,0.1-0.027,0.213-0.085,0.336c-0.075,0.168-0.176,0.346-0.301,0.535l-1.349,2.051
                l-1.287-2.08c-0.095-0.15-0.17-0.276-0.222-0.375c-0.047-0.09-0.083-0.168-0.107-0.231c-0.017-0.046-0.029-0.087-0.033-0.113
                c-0.006-0.039-0.009-0.08-0.031-0.089c0.002-0.001,0.042-0.025,0.162-0.049C14.628,14.776,14.775,14.766,15.004,14.766z"
                />
            </g>
        </SvgIcon>
    );
}

export default ExcellSvg;
