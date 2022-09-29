import './SmallItem.css'
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';

const TinyPrimaryButton = props => {
    return (
        <PrimaryButton
            fontSize="0.5em" 
            width="100px" 
            padding="6px 12px"
            {...props}>{props.children}</PrimaryButton>
    )
}

const TinySecondaryButton = props => {
    return (
        <SecondaryButton
            fontSize="0.5em" 
            width="100px" 
            padding="6px 12px"
            {...props}>{props.children}</SecondaryButton>
    )
}

const SmallItemView = ({ onEdit, onDelete, sitename, username}) => {

    return (
        <div className='view-container'>
            <p title="Site"><span className="sitename">{sitename}</span></p>
            <p title="Username"><span className="username">{username}</span></p>
            <TinyPrimaryButton onClick={onEdit}>Edit</TinyPrimaryButton>
            <TinySecondaryButton onClick={onDelete}>Delete</TinySecondaryButton>
        </div>
    )
}

export default SmallItemView