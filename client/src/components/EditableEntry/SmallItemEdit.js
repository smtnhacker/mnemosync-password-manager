import './SmallItem.css'
import TextInput from "../atoms/TextInput"
import PrimaryButton from '../atoms/PrimaryButton';

const TinyPrimaryButton = props => {
    return (
        <PrimaryButton
            fontSize="0.5em" 
            padding="6px 12px"
            {...props}>{props.children}</PrimaryButton>
    )
}

const SmallItemEdit = ({ onSubmit, sitename, username, password, loading, error }) => {
    const widthStyle = {
        style: {
            width: "85%"
        }
    };

    return (
        <div className='edit-container'>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Site:</label>
                    <TextInput {...widthStyle} type="text" name="sitename" placeholder={sitename} />
                </div>
                <div>
                    <label>Username:</label>
                    <TextInput {...widthStyle} type="text" name="username" placeholder={username} />
                </div>
                <div>
                    <label>Password:</label>
                    {loading ? 
                        <TextInput {...widthStyle} name="password" disabled placeholder="Decoding..." /> :
                        error ? 
                        <TextInput {...widthStyle} name="password" disabled placeholder="Invalid key. Please refresh" /> :
                        <TextInput {...widthStyle} type="text" name="password" placeholder={password} />}
                </div>
                <TinyPrimaryButton width="80%" type="submit" > Submit </TinyPrimaryButton>
            </form>
        </div>
    )
}

export default SmallItemEdit