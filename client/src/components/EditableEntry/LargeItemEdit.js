import './LargeItem.css'
import TextInput from "../atoms/TextInput"
import PrimaryButton from '../atoms/PrimaryButton';

const TinyPrimaryButton = props => {
    return (
        <PrimaryButton
            fontSize="0.5em" 
            width="100px" 
            padding="6px 12px"
            {...props}>{props.children}</PrimaryButton>
    )
}

const LargeItemEdit = ({ onSubmit, sitename, username, password, loading, error }) => {
    return (
        <div className='edit-container'>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Site:</label>
                    <TextInput type="text" name="sitename" placeholder={sitename} />
                </div>
                <div>
                    <label>Username:</label>
                    <TextInput type="text" name="username" placeholder={username} />
                </div>
                <div>
                    <label>Password:</label>
                    {loading ? 
                        <TextInput name="password" disabled placeholder="Decoding..." /> :
                        error ? 
                        <TextInput name="password" disabled placeholder="Invalid key. Please refresh" /> :
                        <TextInput type="text" name="password" placeholder={password} />}
                </div>
                <TinyPrimaryButton width="430px" type="submit" > Submit </TinyPrimaryButton>
            </form>
        </div>
    )
}

export default LargeItemEdit