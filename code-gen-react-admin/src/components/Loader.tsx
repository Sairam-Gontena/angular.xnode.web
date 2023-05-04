import { ProgressSpinner } from 'primereact/progressspinner';
import { BlockUI } from 'primereact/blockui';
import './LoaderStyles.css';

export const Loader = (props: any) => {
    return (
        <>
            {props.loading && (
                <>
                    <BlockUI blocked={props.loading} fullScreen />
                    <ProgressSpinner className='override-spinner'></ProgressSpinner>
                </>
            )}
        </>
    )
}