import { useNavigate, useParams } from 'react-router-dom';

import PracticeApp from './PracticeApp';
import EditEntries from './EditEntries';
import AddEntries from './AddEntries';
import Button from './atoms/Button';

import './styles/Main.css'

function Main() {
    const navigate = useNavigate()
    const { mode } = useParams()

    const handleNew = e => {
        e.preventDefault()
        navigate('/home/add')
    }

    const renderOutlet = () => {
        switch(mode) {
            case "practice": 
                return (
                    <div style={{ 
                        marginTop: "150px", 
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <PracticeApp />
                    </div>
                )
            case "entries": return <EditEntries onNew={handleNew} />;
            case "add": return <AddEntries />;
            default: return <p>404 missing page</p>
        }
    }
    
    return (
        <div className='main-container'>
            {renderOutlet()}
        </div>
    )
}

export default Main;