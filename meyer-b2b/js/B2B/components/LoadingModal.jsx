
B2B.LoadingModal = class extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="loading-animation-area">
                <img className="loading-circle" src={`${options.props.imagePath}/spining_circle.gif`}/>
            </div>
        )
    }
}
